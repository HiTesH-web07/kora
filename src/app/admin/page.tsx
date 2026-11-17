"use client";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Loader2, LogOut } from "lucide-react";
import { Automations } from "@/components/admin/Automations";

interface AdminSettings {
  whatsappNumber: string; instagramUrl: string; location: string; hours: string;
  orderMode: "mock" | "live"; viasocketWebhookUrl: string; viasocketAuthHeaderName: string;
  viasocketAuthHeaderSet: boolean; razorpaySecretSet: boolean; storageDir: string;
  viasocketOrgId: string; viasocketProjectId: string; viasocketSecretSet: boolean;
}
type Errors = Record<string, string>;

const empty: AdminSettings = { whatsappNumber: "", instagramUrl: "", location: "", hours: "", orderMode: "mock", viasocketWebhookUrl: "", viasocketAuthHeaderName: "", viasocketAuthHeaderSet: false, razorpaySecretSet: false, storageDir: "", viasocketOrgId: "", viasocketProjectId: "", viasocketSecretSet: false };

export default function Admin() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [s, setS] = useState<AdminSettings>(empty);
  const [authValue, setAuthValue] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [embedSecret, setEmbedSecret] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [msg, setMsg] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/settings", { cache: "no-store" });
    if (r.ok) { setS(await r.json()); setSignedIn(true); } else setSignedIn(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError(""); setBusy(true);
    const r = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setBusy(false);
    if (r.ok) { setPassword(""); load(); } else setLoginError((await r.json().catch(() => ({}))).error || "Sign in failed.");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErrors({}); setMsg(null);
    const body: Record<string, unknown> = { ...s };
    delete body.viasocketAuthHeaderSet; delete body.razorpaySecretSet; delete body.storageDir; delete body.viasocketSecretSet;
    if (embedSecret) body.viasocketEmbedSecret = embedSecret;
    if (authValue) body.viasocketAuthHeaderValue = authValue;
    if (razorpaySecret) body.razorpayWebhookSecret = razorpaySecret;
    if (newPassword) body.newPassword = newPassword;
    const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) { setS(d.settings); setAuthValue(""); setRazorpaySecret(""); setNewPassword(""); setEmbedSecret(""); setMsg({ kind: "ok", text: "Settings saved." }); }
    else { setErrors(d.errors || {}); setMsg({ kind: "bad", text: d.error || "Could not save." }); }
  };

  const webhookUrl = typeof window === "undefined" ? "" : `${window.location.origin}/api/razorpay/webhook`;
  const copy = () => { navigator.clipboard?.writeText(webhookUrl); setCopied(true); setTimeout(() => setCopied(false), 1600); };

  if (signedIn === null) return <Shell><p className="text-cocoa/70">Loading...</p></Shell>;

  if (!signedIn) return (
    <Shell>
      <form onSubmit={signIn} className="mx-auto mt-16 w-full max-w-sm">
        <h1 className="font-display text-4xl text-burgundy">Kōra admin</h1>
        <p className="mt-2 text-cocoa/80">Sign in to connect WhatsApp, viaSocket and payments.</p>
        <label htmlFor="pw" className="mt-8 block text-sm text-cocoa/80">Admin password</label>
        <input id="pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
        {loginError && <p role="alert" className="mt-2 text-sm text-red-700">{loginError}</p>}
        <button disabled={busy} className="btn-primary mt-6 w-full">{busy ? <Loader2 size={18} className="animate-spin" /> : "Sign in"}</button>
      </form>
    </Shell>
  );

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-burgundy">Kōra admin</h1>
        <button onClick={async () => { await fetch("/api/admin/session", { method: "DELETE" }); setSignedIn(false); }} className="btn-ghost h-10 px-4 text-sm"><LogOut size={16} /> Sign out</button>
      </div>

      {msg && <p role="status" className={`mt-6 border-l-2 px-3 py-2 text-sm ${msg.kind === "ok" ? "border-green-700 bg-green-50 text-green-900" : "border-red-700 bg-red-50 text-red-800"}`}>{msg.text}</p>}

      <Automations keysSaved={s.viasocketSecretSet && !!s.viasocketOrgId && !!s.viasocketProjectId} />

      <form onSubmit={save} className="mt-10 space-y-10">
        <Section title="Shop details" note="These appear on the website as soon as you save.">
          <Row id="whatsappNumber" label="WhatsApp number" hint="Digits with country code, no plus. Example: 919876543210." error={errors.whatsappNumber}>
            <input id="whatsappNumber" inputMode="numeric" value={s.whatsappNumber} onChange={(e) => setS({ ...s, whatsappNumber: e.target.value })} className="field" placeholder="Not set yet" />
          </Row>
          <Row id="instagramUrl" label="Instagram link" error={errors.instagramUrl}>
            <input id="instagramUrl" value={s.instagramUrl} onChange={(e) => setS({ ...s, instagramUrl: e.target.value })} className="field" />
          </Row>
          <Row id="location" label="Location" hint="Shown in the footer.">
            <input id="location" value={s.location} onChange={(e) => setS({ ...s, location: e.target.value })} className="field" placeholder="Stall address" />
          </Row>
          <Row id="hours" label="Opening hours">
            <input id="hours" value={s.hours} onChange={(e) => setS({ ...s, hours: e.target.value })} className="field" placeholder="e.g. Mon to Sun, 5pm to 11pm" />
          </Row>
        </Section>

        <Section title="Orders" note="Mock keeps the site safe to test: orders are accepted but nothing is sent anywhere and no money moves.">
          <Row id="orderMode" label="Order mode" error={errors.orderMode}>
            <div className="flex gap-2 pt-2">
              {(["mock", "live"] as const).map((m) => (
                <button type="button" key={m} onClick={() => setS({ ...s, orderMode: m })}
                  className={`rounded-full border px-5 py-2 text-sm ${s.orderMode === m ? "border-burgundy bg-burgundy text-cream" : "border-cocoa/30 text-cocoa hover:border-burgundy"}`}>
                  {m === "mock" ? "Mock (testing)" : "Live"}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        <Section title="viaSocket keys" note="The three values from your viaSocket account. They are stored on the server only and switch on the Automations screens above.">
          <Row id="viasocketOrgId" label="VIASOCKET_ORG_ID">
            <input id="viasocketOrgId" value={s.viasocketOrgId} onChange={(e) => setS({ ...s, viasocketOrgId: e.target.value })} className="field" autoComplete="off" />
          </Row>
          <Row id="viasocketProjectId" label="VIASOCKET_PROJECT_ID">
            <input id="viasocketProjectId" value={s.viasocketProjectId} onChange={(e) => setS({ ...s, viasocketProjectId: e.target.value })} className="field" autoComplete="off" />
          </Row>
          <Row id="viasocketEmbedSecret" label="VIASOCKET_EMBED_SECRET" hint={s.viasocketSecretSet ? "Saved. Type a new value to replace it." : "Not set."}>
            <input id="viasocketEmbedSecret" type="password" value={embedSecret} onChange={(e) => setEmbedSecret(e.target.value)} className="field" autoComplete="off" placeholder={s.viasocketSecretSet ? "••••••••" : ""} />
          </Row>
        </Section>

        <Section title="Optional: your own webhook URL" note="Only if you built a flow directly in viaSocket and want orders posted to its webhook as well.">
          <Row id="viasocketWebhookUrl" label="Webhook URL" error={errors.viasocketWebhookUrl}>
            <input id="viasocketWebhookUrl" value={s.viasocketWebhookUrl} onChange={(e) => setS({ ...s, viasocketWebhookUrl: e.target.value })} className="field" placeholder="https://..." />
          </Row>
          <Row id="viasocketAuthHeaderName" label="Auth header name" hint="Only if your flow needs one, e.g. Authorization.">
            <input id="viasocketAuthHeaderName" value={s.viasocketAuthHeaderName} onChange={(e) => setS({ ...s, viasocketAuthHeaderName: e.target.value })} className="field" />
          </Row>
          <Row id="viasocketAuthHeaderValue" label="Auth header value" hint={s.viasocketAuthHeaderSet ? "Saved. Type a new value to replace it." : "Not set."}>
            <input id="viasocketAuthHeaderValue" type="password" value={authValue} onChange={(e) => setAuthValue(e.target.value)} className="field" placeholder={s.viasocketAuthHeaderSet ? "••••••••" : ""} />
          </Row>
        </Section>

        <Section title="Razorpay" note="Only a correctly signed Razorpay webhook can mark an order paid.">
          <Row id="razorpayWebhookSecret" label="Webhook secret" hint={s.razorpaySecretSet ? "Saved. Type a new value to replace it." : "Not set."}>
            <input id="razorpayWebhookSecret" type="password" value={razorpaySecret} onChange={(e) => setRazorpaySecret(e.target.value)} className="field" placeholder={s.razorpaySecretSet ? "••••••••" : ""} />
          </Row>
          <Row id="hook" label="Webhook URL to paste into Razorpay">
            <div className="flex items-center gap-2 pt-1">
              <code className="flex-1 overflow-x-auto whitespace-nowrap bg-cream px-3 py-2 text-sm">{webhookUrl}</code>
              <button type="button" onClick={copy} className="btn-ghost h-10 px-3 text-sm">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
            </div>
          </Row>
        </Section>

        <Section title="Admin password" note="Change the password you used to sign in.">
          <Row id="newPassword" label="New password" hint="At least 8 characters. Leave blank to keep the current one." error={errors.newPassword}>
            <input id="newPassword" type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="field" />
          </Row>
        </Section>

        <div className="sticky bottom-0 -mx-5 border-t border-burgundy/10 bg-paper px-5 py-4 md:-mx-8 md:px-8">
          <button disabled={busy} className="btn-primary w-full md:w-auto">{busy ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : "Save settings"}</button>
        </div>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10 md:px-8">
      <a href="/" className="text-sm text-burgundy hover:underline">Back to the website</a>
      <div className="mt-4">{children}</div>
    </main>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-burgundy/15 pt-6">
      <h2 className="font-display text-2xl text-burgundy">{title}</h2>
      {note && <p className="mt-1 max-w-xl text-sm text-cocoa/75">{note}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Row({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-cocoa/80">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-cocoa/60">{hint}</p>}
      {error && <p role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}
