import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/adminAuth";
import { applyFlowEvent, automationsView, syncAutomations } from "@/lib/automations";

export const dynamic = "force-dynamic";
const denied = () => NextResponse.json({ error: "Sign in first." }, { status: 401 });

export async function GET(req: Request) {
  if (!isSignedIn(req)) return denied();
  try { await syncAutomations(); } catch { /* show what we have */ }
  return NextResponse.json({ automations: automationsView() });
}

/** The embedded screens report a change; we only trust the flow id and re-read the rest from viaSocket. */
export async function POST(req: Request) {
  if (!isSignedIn(req)) return denied();
  const { flowId, action } = await req.json().catch(() => ({}));
  if (typeof flowId !== "string" || !/^[\w-]{4,80}$/.test(flowId) || !["initiated", "published", "updated", "paused", "deleted"].includes(action)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  try {
    const result = await applyFlowEvent(flowId, action);
    return NextResponse.json({ ...result, automations: automationsView() }, { status: result.ok ? 200 : 422 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "viaSocket could not be reached." }, { status: 502 });
  }
}
