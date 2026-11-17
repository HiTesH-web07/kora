"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { useCheckout } from "@/lib/useCheckout";
import { orderWhatsAppLink } from "@/lib/whatsapp";
import { useConfig } from "@/store/config";
import type { CustomerInput, PaymentMethod } from "@/lib/types";

type View = "cart" | "checkout";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove } = useCart();
  const [view, setView] = useState<View>("cart");
  const co = useCheckout();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, setOpen]);

  useEffect(() => { if (!open) { setView("cart"); } }, [open]);
  const close = () => { setOpen(false); if (co.order) co.setOrder(null); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="scrim" className="fixed inset-0 z-50 bg-cocoa/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside key="drawer" role="dialog" aria-modal="true" aria-label="Your box"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-between border-b border-burgundy/10 px-6 py-4">
              {view === "checkout" && !co.order ? (
                <button onClick={() => setView("cart")} className="flex items-center gap-2 text-burgundy"><ArrowLeft size={18} /> Back to box</button>
              ) : (
                <h2 className="font-display text-3xl text-burgundy">{co.order ? "Order placed" : "Your box"}</h2>
              )}
              <button onClick={close} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full text-burgundy hover:bg-burgundy/5"><X size={22} /></button>
            </div>

            {co.order ? (
              <Confirmation co={co} onDone={close} />
            ) : view === "cart" ? (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {lines.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <ShoppingBag size={40} className="text-blush" />
                      <p className="font-display text-2xl text-burgundy">Your box is empty</p>
                      <p className="text-cocoa/80">Add something sweet from the menu.</p>
                      <a href="#menu" onClick={close} className="btn-primary">Browse the menu</a>
                    </div>
                  ) : (
                    <ul className="divide-y divide-burgundy/10">
                      {lines.map(({ product: p, qty }) => (
                        <motion.li layout key={p.id} className="flex gap-4 py-5">
                          <img src={p.image} alt="" className="h-20 w-20 shrink-0 object-cover" style={{ objectPosition: p.imagePosition }} />
                          <div className="flex-1">
                            <p className="font-display text-xl leading-tight text-burgundy">{p.name}</p>
                            <p className="mt-0.5 text-sm text-cocoa/80">{formatPrice(p.price)}</p>
                            <div className="mt-3 flex items-center gap-3">
                              <div className="flex items-center border border-burgundy/30">
                                <button onClick={() => setQty(p.id, qty - 1)} aria-label={`Decrease ${p.name}`} className="flex h-9 w-9 items-center justify-center text-burgundy hover:bg-burgundy/5"><Minus size={16} /></button>
                                <span className="w-8 text-center" aria-live="polite">{qty}</span>
                                <button onClick={() => setQty(p.id, qty + 1)} aria-label={`Increase ${p.name}`} className="flex h-9 w-9 items-center justify-center text-burgundy hover:bg-burgundy/5"><Plus size={16} /></button>
                              </div>
                              <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="flex h-9 w-9 items-center justify-center text-cocoa/60 hover:text-burgundy"><Trash2 size={17} /></button>
                            </div>
                          </div>
                          <p className="font-medium text-cocoa">{formatPrice(p.price * qty)}</p>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
                {lines.length > 0 && (
                  <div className="border-t border-burgundy/10 px-6 py-5">
                    <div className="flex items-baseline justify-between"><span>Subtotal</span><span className="font-display text-3xl text-burgundy">{formatPrice(subtotal)}</span></div>
                    <p className="mt-1 text-sm text-cocoa/70">Delivery charges, if any, are confirmed on WhatsApp.</p>
                    <button onClick={() => setView("checkout")} className="btn-primary mt-4 w-full">Continue to checkout</button>
                  </div>
                )}
              </>
            ) : (
              <CheckoutForm co={co} total={subtotal} count={lines.length} />
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

type Checkout = ReturnType<typeof useCheckout>;

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-cocoa/80">{label}</label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

function CheckoutForm({ co, total, count }: { co: Checkout; total: number; count: number }) {
  const { form, update, errors } = co;
  const text = (k: keyof CustomerInput, extra: object = {}) => ({
    id: k, value: form[k] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(k, e.target.value),
    className: `field ${errors[k] ? "field-error" : ""}`, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined, ...extra,
  });
  const methods: { id: PaymentMethod; title: string; hint: string }[] = [
    { id: "pay_online", title: "Pay online (Razorpay)", hint: "We send a secure payment link on WhatsApp. Your order is confirmed once payment goes through." },
    { id: "whatsapp", title: "Order on WhatsApp", hint: "We message you on WhatsApp to confirm the order and payment details." },
  ];
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); co.submit(); }} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <Field id="name" label="Full name" error={errors.name}><input {...text("name", { autoComplete: "name" })} /></Field>
        <Field id="whatsapp" label="WhatsApp number" error={errors.whatsapp}><input {...text("whatsapp", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "e.g. 98765 43210" })} /></Field>
        <Field id="address" label="Delivery address" error={errors.address}><textarea rows={3} {...text("address", { autoComplete: "street-address" })} /></Field>
        <Field id="notes" label="Order notes (optional)" error={errors.notes}><textarea rows={2} {...text("notes", { maxLength: 320, placeholder: "Message on the cake, allergies, delivery time..." })} /></Field>
        <fieldset>
          <legend className="text-sm text-cocoa/80">How would you like to order?</legend>
          <div className="mt-2 space-y-2">
            {methods.map((m) => (
              <label key={m.id} className={`flex cursor-pointer gap-3 border p-3 transition-colors ${co.method === m.id ? "border-burgundy bg-burgundy/5" : "border-cocoa/20 hover:border-burgundy/50"}`}>
                <input type="radio" name="method" checked={co.method === m.id} onChange={() => co.setMethod(m.id)} className="mt-1 accent-[#762E42]" />
                <span><span className="block font-medium text-burgundy">{m.title}</span><span className="block text-sm text-cocoa/75">{m.hint}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="border-t border-burgundy/10 px-6 py-5">
        {co.serverError && <p role="alert" className="mb-3 border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{co.serverError}</p>}
        <div className="flex items-baseline justify-between"><span>Total ({count} {count === 1 ? "item" : "items"})</span><span className="font-display text-3xl text-burgundy">{formatPrice(total)}</span></div>
        <button type="submit" disabled={co.submitting || count === 0} className="btn-primary mt-4 w-full">
          {co.submitting ? <><Loader2 size={18} className="animate-spin" /> Placing your order...</> : "Place order"}
        </button>
      </div>
    </form>
  );
}

function Confirmation({ co, onDone }: { co: Checkout; onDone: () => void }) {
  const o = co.order!;
  const cfg = useConfig();
  const wa = orderWhatsAppLink(cfg.whatsappNumber, { orderId: o.orderId, lines: o.lines, total: o.total, customerName: o.customer.name });
  const paid = o.status === "paid";
  const online = o.paymentMethod === "pay_online";
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
      <motion.svg viewBox="0 0 80 80" className="mx-auto h-24 w-24 text-burgundy" >
        <motion.circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="3" initial={{ pathLength: 0 } as any} animate={{ pathLength: 1 } as any} transition={{ duration: 0.6 }} />
        <motion.path d="M24 41l11 11 21-23" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 } as any} animate={{ pathLength: 1 } as any} transition={{ duration: 0.45, delay: 0.5 }} />
      </motion.svg>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-6 text-center">
        <p className="font-display text-4xl text-burgundy">Thank you, {o.customer.name.split(" ")[0]}!</p>
        <p className="mt-2 text-cocoa">Order <span className="font-medium">{o.orderId}</span> is in.</p>
        <p className="hand mt-3 text-2xl text-burgundy">
          {online ? (paid ? "Payment received. We're on it!" : "Waiting for your payment...") : "We'll message you on WhatsApp to confirm."}
        </p>
        {online && !paid && <p className="mt-1 text-sm text-cocoa/75">Use the payment link we send on WhatsApp. This page updates once payment is confirmed.</p>}
      </motion.div>
      <ul className="mt-8 divide-y divide-burgundy/10 border-y border-burgundy/10 text-sm">
        {o.lines.map((l) => <li key={l.id} className="flex justify-between py-2.5"><span>{l.qty} x {l.name}</span><span>{formatPrice(l.lineTotal)}</span></li>)}
        <li className="flex justify-between py-3 font-medium"><span>Total</span><span>{formatPrice(o.total)}</span></li>
      </ul>
      <div className="mt-6 space-y-3">
        {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">Message us on WhatsApp</a>}
        {o.mode === "mock" && (
          <div className="border border-dashed border-gold p-3 text-sm text-cocoa/80">
            <p>Mock order mode: nothing was sent to viaSocket and no money moves.</p>
            {online && !paid && <button onClick={co.simulatePayment} className="btn-ghost mt-2 w-full">Simulate successful payment</button>}
          </div>
        )}
        <button onClick={onDone} className="btn-ghost w-full">Keep browsing</button>
      </div>
    </div>
  );
}
