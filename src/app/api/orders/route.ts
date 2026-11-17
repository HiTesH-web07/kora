import { NextResponse } from "next/server";
import crypto from "crypto";
import { productById } from "@/data/products";
import { findByIdempotencyKey, saveOrder, setStatus } from "@/lib/orderStore";
import { normalizePhone, validateCustomer } from "@/lib/validation";
import { orderMode, submitOrderToViaSocket } from "@/lib/viasocket";
import type { Order, OrderLine, OrderRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

const publicView = (o: Order) => ({
  orderId: o.orderId, status: o.status, paymentMethod: o.paymentMethod, lines: o.lines,
  subtotal: o.subtotal, total: o.total, mode: o.mode, customer: { name: o.customer.name },
});

export async function POST(req: Request) {
  let body: OrderRequest;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const { customer, items, paymentMethod, idempotencyKey } = body ?? ({} as OrderRequest);
  if (!customer || !Array.isArray(items) || !idempotencyKey || typeof idempotencyKey !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (paymentMethod !== "pay_online" && paymentMethod !== "whatsapp") {
    return NextResponse.json({ error: "Choose a valid order method." }, { status: 400 });
  }
  const fieldErrors = validateCustomer(customer);
  if (Object.keys(fieldErrors).length) return NextResponse.json({ error: "Please fix the highlighted fields.", fieldErrors }, { status: 422 });

  // Duplicate submission (double click / retry): return the order we already created.
  const existing = findByIdempotencyKey(idempotencyKey);
  if (existing) return NextResponse.json({ order: publicView(existing), duplicate: true });

  // Prices are always recomputed on the server; never trust the client.
  const lines: OrderLine[] = [];
  for (const it of items) {
    const p = productById(it.id);
    const qty = Math.floor(Number(it.qty));
    if (!p || !(qty >= 1 && qty <= 50)) return NextResponse.json({ error: "Your cart has an item that is no longer available." }, { status: 400 });
    lines.push({ id: p.id, name: p.name, qty, unitPrice: p.price, lineTotal: p.price * qty });
  }
  if (!lines.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const order: Order = {
    orderId: "KORA-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
    idempotencyKey,
    createdAt: new Date().toISOString(),
    status: paymentMethod === "pay_online" ? "pending_payment" : "received",
    paymentMethod,
    customer: { name: customer.name.trim(), whatsapp: normalizePhone(customer.whatsapp), address: customer.address.trim(), notes: customer.notes?.trim() || undefined },
    lines, subtotal, total: subtotal, mode: orderMode(),
  };
  saveOrder(order);

  const result = await submitOrderToViaSocket(order);
  if (!result.ok) {
    setStatus(order.orderId, "submission_failed");
    console.error("[orders] viaSocket submission failed:", result.error);
    return NextResponse.json({ error: "We couldn't send your order just now. Nothing was charged. Please try again.", orderId: order.orderId }, { status: 502 });
  }
  return NextResponse.json({ order: publicView(order) }, { status: 201 });
}
