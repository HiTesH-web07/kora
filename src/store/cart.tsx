"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productById, type Product } from "@/data/products";

interface CartLine { id: string; qty: number }
interface CartCtx {
  lines: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toast: string | null;
  hydrated: boolean;
}

const KEY = "kora-cart-v1";
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]") as CartLine[];
      setRaw(saved.filter((l) => productById(l.id) && l.qty > 0));
    } catch { /* ignore corrupt storage */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) { try { localStorage.setItem(KEY, JSON.stringify(raw)); } catch { /* storage full/blocked */ } } }, [raw, hydrated]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t); }, [toast]);

  const add = useCallback((id: string) => {
    setRaw((r) => (r.some((l) => l.id === id) ? r.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + 1, 50) } : l)) : [...r, { id, qty: 1 }]));
    setToast(`${productById(id)?.name ?? "Item"} added to your box`);
  }, []);
  const setQty = useCallback((id: string, qty: number) => setRaw((r) => (qty <= 0 ? r.filter((l) => l.id !== id) : r.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 50) } : l)))), []);
  const remove = useCallback((id: string) => setRaw((r) => r.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartCtx>(() => {
    const lines = raw.flatMap((l) => { const product = productById(l.id); return product ? [{ product, qty: l.qty }] : []; });
    return {
      lines, count: lines.reduce((s, l) => s + l.qty, 0), subtotal: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
      open, setOpen, add, setQty, remove, clear, toast, hydrated,
    };
  }, [raw, open, add, setQty, remove, clear, toast, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
