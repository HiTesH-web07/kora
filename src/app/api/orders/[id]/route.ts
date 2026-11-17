import { NextResponse } from "next/server";
import { getOrder, setStatus } from "@/lib/orderStore";

export const dynamic = "force-dynamic";

const view = (o: NonNullable<ReturnType<typeof getOrder>>) => ({ orderId: o.orderId, status: o.status, mode: o.mode, paymentMethod: o.paymentMethod });

/** Status polling. "paid" is only ever set by the verified Razorpay webhook. */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const o = getOrder(params.id);
  if (!o) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json(view(o));
}

/** Development helper: simulate a successful payment. Disabled unless ORDER_MODE=mock. */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const o = getOrder(params.id);
  if (!o) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  if (o.mode !== "mock" || body?.action !== "mock-pay") return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  return NextResponse.json(view(setStatus(o.orderId, "paid") ?? o));
}
