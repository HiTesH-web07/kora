import fs from "fs";
import path from "path";
import { ViaSocket } from "viasocket-apps";
import { DATA_PATH, readSettings } from "./settings";

/**
 * Automations the owners build on /admin with viaSocket's prebuilt screens.
 * The browser only ever tells us a flow id; the server reads the flow from viaSocket
 * itself and keeps its run URL here, under DATA_DIR. A run URL is a credential:
 * it never goes to the browser.
 */
export const OWNER_ID = "kora-owners"; // one viaSocket user for the whole bakery
const FILE = path.join(DATA_PATH, "automations.json");
const RUN_HOST = "https://flow.sokt.io/";

export interface Automation { id: string; title: string; status: "active" | "paused"; url: string; updatedAt: string }

export function viasocketUser() {
  const s = readSettings();
  if (!s.viasocketOrgId || !s.viasocketProjectId || !s.viasocketEmbedSecret) return null;
  return new ViaSocket({ orgId: s.viasocketOrgId, projectId: s.viasocketProjectId, secret: s.viasocketEmbedSecret }).user(OWNER_ID);
}

export function readAutomations(): Automation[] {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")) as Automation[]; } catch { return []; }
}
function write(list: Automation[]) {
  fs.mkdirSync(DATA_PATH, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), { mode: 0o600 });
}
export const activeAutomations = () => readAutomations().filter((a) => a.status === "active");
/** Safe for the admin browser: no run URLs. */
export const automationsView = () => readAutomations().map(({ id, title, status, updatedAt }) => ({ id, title, status, updatedAt }));

const isActive = (status: string) => ["active", "1", "published"].includes(String(status).toLowerCase());

/** Applies one event from the embedded screens. The flow is always re-read from viaSocket. */
export async function applyFlowEvent(flowId: string, action: string): Promise<{ ok: boolean; error?: string }> {
  const list = readAutomations().filter((a) => a.id !== flowId);
  if (action === "deleted") { write(list); return { ok: true }; }
  if (action === "initiated") return { ok: true }; // a draft: nothing to run yet

  const user = viasocketUser();
  if (!user) return { ok: false, error: "viaSocket keys are not set." };
  const flow = (await user.listFlows()).find((f) => f.id === flowId);
  if (!flow) return { ok: false, error: "That automation was not found in this account." };
  if (!flow.webhook || !flow.webhook.startsWith(RUN_HOST)) { write(list); return { ok: false, error: "That automation has no run link." }; }

  const status = action === "paused" || !isActive(flow.status) ? "paused" : "active";
  write([...list, { id: flow.id, title: flow.title || "Untitled automation", status, url: flow.webhook, updatedAt: new Date().toISOString() }]);
  return { ok: true };
}

/** Re-checks every stored automation against viaSocket (paused or deleted elsewhere). */
export async function syncAutomations(): Promise<void> {
  const user = viasocketUser();
  const stored = readAutomations();
  if (!user || !stored.length) return;
  const flows = await user.listFlows();
  const next: Automation[] = [];
  for (const a of stored) {
    const f = flows.find((x) => x.id === a.id);
    if (!f || String(f.status).toLowerCase() === "deleted" || !f.webhook?.startsWith(RUN_HOST)) continue;
    next.push({ ...a, title: f.title || a.title, url: f.webhook, status: isActive(f.status) ? "active" : "paused" });
  }
  write(next);
}

/** Where a new order goes in live mode: every active automation, plus the optional manual webhook. */
export function orderTargets(): { url: string; headers: Record<string, string>; label: string }[] {
  const s = readSettings();
  const json: Record<string, string> = { "Content-Type": "application/json" };
  const targets: { url: string; headers: Record<string, string>; label: string }[] = activeAutomations().map((a) => ({ url: a.url, headers: { ...json }, label: a.title }));
  if (s.viasocketWebhookUrl) {
    const headers: Record<string, string> = { ...json };
    if (s.viasocketAuthHeaderName && s.viasocketAuthHeaderValue) headers[s.viasocketAuthHeaderName] = s.viasocketAuthHeaderValue;
    targets.push({ url: s.viasocketWebhookUrl, headers, label: "Webhook URL" });
  }
  return targets;
}

export async function postToTargets(body: unknown) {
  const targets = orderTargets();
  const results = await Promise.all(targets.map(async (t) => {
    try {
      const res = await fetch(t.url, { method: "POST", headers: t.headers, body: JSON.stringify(body), cache: "no-store" });
      return { label: t.label, ok: res.ok, status: res.status };
    } catch (err) {
      return { label: t.label, ok: false, status: 0, error: err instanceof Error ? err.message : "Network error" };
    }
  }));
  return results;
}
