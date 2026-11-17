import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/adminAuth";
import { readSettings } from "@/lib/settings";
import { orderTargets, postToTargets } from "@/lib/automations";

export const dynamic = "force-dynamic";

/** Sends one sample order to every active automation (and the webhook URL) so the owner can see it arrive. */
export async function POST(req: Request) {
  if (!isSignedIn(req)) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (orderTargets().length === 0) return NextResponse.json({ ok: false, error: "Publish an automation or add a webhook URL first." }, { status: 400 });
  const s = readSettings();
  const sample = {
    test: true, orderId: "KORA-TEST01", createdAt: new Date().toISOString(), paymentMethod: "whatsapp",
    customer: { name: "Test order", whatsapp: s.whatsappNumber, address: "Test address", notes: "Sent from the Kora admin page" },
    items: [{ id: "waffle-quad", name: "Four-Corner Brownie Waffle", qty: 1, unitPrice: 249, lineTotal: 249 }],
    subtotal: 249, total: 249, currency: "INR",
  };
  const results = await postToTargets(sample);
  return NextResponse.json({ ok: results.every((r) => r.ok), results });
}
