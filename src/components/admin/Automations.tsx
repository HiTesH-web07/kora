"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Send } from "lucide-react";

const EMBED_SCRIPT = "https://embed.viasocket.com/prod-embedcomponent.js";
const EMBED_ORIGIN = "https://embedfrontend.viasocket.com";
const BOX_ID = "kora-automations";

interface Row { id: string; title: string; status: "active" | "paused"; updatedAt: string }
type Embed = { destroy?: () => void };
declare global { interface Window { viaSocket?: { mount: (o: Record<string, unknown>) => Embed } } }

const loadScript = () => new Promise<void>((resolve, reject) => {
  if (window.viaSocket) return resolve();
  const s = document.createElement("script");
  s.src = EMBED_SCRIPT; s.async = true;
  s.onload = () => resolve(); s.onerror = () => reject(new Error("The viaSocket screens could not load."));
  document.head.appendChild(s);
});

/** viaSocket's ready-made screens: connect apps and build what happens on each new order. */
export function Automations({ keysSaved }: { keysSaved: boolean }) {
  const [state, setState] = useState<"loading" | "nokeys" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const embed = useRef<Embed | null>(null);

  const refresh = useCallback(async () => {
    const r = await fetch("/api/admin/viasocket/flows", { cache: "no-store" });
    if (r.ok) setRows((await r.json()).automations);
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Listen before mounting so no event is missed. Only messages from viaSocket's own frame count.
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== EMBED_ORIGIN) return;
      const flow = event.data as { id?: string; action?: string };
      if (!flow?.id || !flow.action) return;
      const r = await fetch("/api/admin/viasocket/flows", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowId: flow.id, action: flow.action }), // only the id: the server reads the rest itself
      });
      const d = await r.json().catch(() => ({}));
      if (d.automations) setRows(d.automations);
      if (!r.ok && flow.action !== "initiated") setNote({ ok: false, text: d.error || "That change could not be saved." });
    };
    window.addEventListener("message", onMessage);

    (async () => {
      try {
        const r = await fetch("/api/admin/viasocket/token", { cache: "no-store" });
        const d = await r.json();
        if (cancelled) return;
        if (!d.configured) return setState("nokeys");
        if (!d.token) throw new Error(d.error || "Could not start viaSocket.");
        await loadScript();
        if (cancelled || !window.viaSocket) return;
        embed.current = window.viaSocket.mount({
          embedToken: d.token, parent: `#${BOX_ID}`,
          config: {
            pageheading: "Automation",
            pagesubheading: "Choose what happens every time a new order comes in.",
            themeJson: { "--primary-color": "#762E42" },
          },
        });
        setState("ready");
        refresh();
      } catch (e) {
        if (!cancelled) { setError(e instanceof Error ? e.message : "Something went wrong."); setState("error"); }
      }
    })();

    return () => { cancelled = true; window.removeEventListener("message", onMessage); embed.current?.destroy?.(); embed.current = null; };
  }, [keysSaved, refresh]);

  const sendTest = async () => {
    setTesting(true); setNote(null);
    const r = await fetch("/api/admin/test", { method: "POST" });
    const d = await r.json().catch(() => ({}));
    setTesting(false);
    setNote(d.ok ? { ok: true, text: "Test order sent. Check that it arrived where your automation sends it." }
      : { ok: false, text: d.error || `Some automations did not accept the test order (${(d.results || []).filter((x: { ok: boolean }) => !x.ok).map((x: { label: string; status: number }) => `${x.label}: ${x.status}`).join(", ")}).` });
  };

  return (
    <section className="mt-8 border-t border-burgundy/15 pt-6">
      <h2 className="font-display text-2xl text-burgundy">Automations</h2>
      <p className="mt-1 max-w-xl text-sm text-cocoa/75">Connect WhatsApp, Razorpay, Google Sheets or any other app, then publish what should happen on each new order. Every published automation receives every live order.</p>

      {state === "nokeys" && <p className="mt-5 border-l-2 border-gold bg-cream px-3 py-2 text-sm text-cocoa">Add your three viaSocket keys under &ldquo;viaSocket keys&rdquo; below and save. The automation screens appear here straight after.</p>}
      {state === "error" && <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      {state === "loading" && <p className="mt-5 flex items-center gap-2 text-sm text-cocoa/70"><Loader2 size={16} className="animate-spin" /> Loading...</p>}

      <div id={BOX_ID} className={`mt-5 w-full border border-burgundy/15 bg-white ${state === "ready" ? "h-[680px]" : "hidden"}`} />

      {state === "ready" && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-medium text-burgundy">Receiving orders</h3>
            <div className="flex gap-2">
              <button type="button" onClick={refresh} className="btn-ghost h-9 px-3 text-sm"><RefreshCw size={15} /> Refresh</button>
              <button type="button" onClick={sendTest} disabled={testing || !rows.some((r) => r.status === "active")} className="btn-ghost h-9 px-3 text-sm">
                {testing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Send a test order
              </button>
            </div>
          </div>
          {rows.length === 0 ? (
            <p className="mt-3 text-sm text-cocoa/70">Nothing published yet. Build an automation above and click Publish.</p>
          ) : (
            <ul className="mt-3 divide-y divide-burgundy/10 border-y border-burgundy/10 text-sm">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-2.5">
                  <span>{r.title}</span>
                  <span className={r.status === "active" ? "text-green-800" : "text-cocoa/60"}>{r.status === "active" ? "Active" : "Paused"}</span>
                </li>
              ))}
            </ul>
          )}
          {note && <p role="status" className={`mt-3 border-l-2 px-3 py-2 text-sm ${note.ok ? "border-green-700 bg-green-50 text-green-900" : "border-red-700 bg-red-50 text-red-800"}`}>{note.text}</p>}
        </div>
      )}
    </section>
  );
}
