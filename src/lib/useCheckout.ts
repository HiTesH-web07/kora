"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/store/cart";
import { validateCustomer, type FieldErrors } from "./validation";
import type { CustomerInput, OrderLine, OrderStatus, PaymentMethod } from "./types";

export interface PlacedOrder {
  orderId: string; status: OrderStatus; paymentMethod: PaymentMethod; lines: OrderLine[];
  total: number; mode: "mock" | "live"; customer: { name: string };
}

const newKey = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random());

export function useCheckout() {
  const { lines, clear } = useCart();
  const [form, setForm] = useState<CustomerInput>({ name: "", whatsapp: "", address: "", notes: "" });
  const [method, setMethod] = useState<PaymentMethod>("pay_online");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const key = useRef(newKey());
  const inFlight = useRef(false); // synchronous guard against double clicks

  const update = (k: keyof CustomerInput, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const submit = useCallback(async () => {
    if (inFlight.current) return;
    const e = validateCustomer(form);
    setErrors(e);
    setServerError(null);
    if (Object.keys(e).length) return;
    if (!lines.length) { setServerError("Your box is empty."); return; }

    inFlight.current = true; setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items: lines.map((l) => ({ id: l.product.id, qty: l.qty })), paymentMethod: method, idempotencyKey: key.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.order) {
        setOrder(data.order); clear(); key.current = newKey();
      } else {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setServerError(data.error || "Something went wrong. Please try again.");
        key.current = newKey(); // a rejected attempt is retried as a fresh order
      }
    } catch {
      // Network failure: keep the same key so a retry can never create a duplicate order.
      setServerError("Couldn't reach the server. Check your connection and try again.");
    } finally { inFlight.current = false; setSubmitting(false); }
  }, [form, lines, method, clear]);

  // After a pay_online order, poll until the verified webhook marks it paid.
  useEffect(() => {
    if (!order || order.paymentMethod !== "pay_online" || order.status === "paid") return;
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/orders/${order.orderId}`, { cache: "no-store" });
        if (r.ok) { const d = await r.json(); if (d.status === "paid") setOrder((o) => (o ? { ...o, status: "paid" } : o)); }
      } catch { /* retry on next tick */ }
    }, 4000);
    return () => clearInterval(t);
  }, [order]);

  const simulatePayment = async () => {
    if (!order) return;
    const r = await fetch(`/api/orders/${order.orderId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "mock-pay" }) });
    if (r.ok) setOrder((o) => (o ? { ...o, status: "paid" } : o));
  };

  return { form, update, method, setMethod, errors, serverError, submitting, order, setOrder, submit, simulatePayment };
}
