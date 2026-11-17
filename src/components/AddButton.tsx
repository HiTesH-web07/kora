"use client";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/store/cart";

export function AddButton({ id, name, tone = "dark" }: { id: string; name: string; tone?: "dark" | "light" }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const base = tone === "dark" ? "bg-burgundy text-cream hover:bg-cocoa" : "bg-cream text-burgundy hover:bg-blush";
  return (
    <button
      onClick={() => { add(id); setDone(true); setTimeout(() => setDone(false), 1300); }}
      aria-label={`Add ${name} to your box`}
      className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all duration-200 active:scale-95 ${base}`}
    >
      {done ? <><Check size={16} /> Added</> : <><Plus size={16} /> Add</>}
    </button>
  );
}
