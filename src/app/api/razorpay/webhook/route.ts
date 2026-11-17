import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getOrder, setStatus } from "@/lib/orderStore";
import { readSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

/**
 * Razorpay webhook receiver. Only a request with a valid X-Razorpay-Signature can mark an order paid.
 *
 * Assumption to confirm when the viaSocket/Razorpay flow is built: the payment link (or order) is
 * created with our orderId as `reference_id` (payment links) or `notes.order_id` (payments/orders),
 * which is how we map a payment back to an order below.
 */
export async function POST(req: Request) {
  const raw = await req.text(); // raw body is required for signature verification
  const ok = verifyRazorpaySignature(raw, req.headers.get("x-razorpay-signature"), readSettings().razorpayWebhookSecret);
  if (!ok) return NextResponse.json({ error: "Invalid signature." }, { status: 400 });

  let event: any;
  try { event = JSON.parse(raw); } catch { return NextResponse.json({ error: "Bad payload." }, { status: 400 }); }

  const type: string = event?.event ?? "";
  if (!["payment_link.paid", "order.paid", "payment.captured"].includes(type)) return NextResponse.json({ ignored: type });

  const payload = event?.payload ?? {};
  const orderId: string | undefined =
    payload.payment_link?.entity?.reference_id ??
    payload.payment?.entity?.notes?.order_id ??
    payload.order?.entity?.notes?.order_id;
  const paidPaise: number | undefined = payload.payment?.entity?.amount ?? payload.order?.entity?.amount_paid ?? payload.payment_link?.entity?.amount_paid;

  const order = orderId ? getOrder(orderId) : undefined;
  if (!order) return NextResponse.json({ ignored: "unknown order" });
  if (typeof paidPaise === "number" && paidPaise < order.total * 100) return NextResponse.json({ ignored: "amount mismatch" });

  setStatus(order.orderId, "paid");
  return NextResponse.json({ ok: true });
}
