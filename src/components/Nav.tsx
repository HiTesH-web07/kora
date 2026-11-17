"use client";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/store/cart";

const links = [
  { href: "#story", label: "Our story" },
  { href: "#menu", label: "Menu" },
  { href: "#gifting", label: "Gifting" },
  { href: "#moments", label: "Little moments" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex flex-col items-start leading-none ${light ? "text-cream" : "text-burgundy"}`}>
      <span className="font-display text-[2rem] font-medium tracking-tight">Kōra</span>
      <span className="-mt-0.5 ml-0.5 text-[0.6rem] tracking-[0.32em]">BAKEHOUSE</span>
    </span>
  );
}

export function Nav() {
  const [mobile, setMobile] = useState(false);
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-burgundy/10 bg-paper/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" aria-label="Kōra Bakehouse, back to top"><Logo /></a>
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[0.95rem] text-cocoa transition-colors hover:text-burgundy">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(true)} className="relative flex h-11 items-center gap-2 rounded-full px-3 text-burgundy hover:bg-burgundy/5" aria-label={`Open your box, ${count} items`}>
            <ShoppingBag size={22} />
            <span className="hidden text-[0.95rem] sm:inline">Your box</span>
            {count > 0 && (
              <span key={count} className="flex h-5 min-w-5 animate-[pop_.35s_ease] items-center justify-center rounded-full bg-burgundy px-1.5 text-xs font-medium text-cream">{count}</span>
            )}
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full text-burgundy hover:bg-burgundy/5 md:hidden" onClick={() => setMobile((m) => !m)} aria-expanded={mobile} aria-label="Toggle menu">
            {mobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobile && (
        <nav className="border-t border-burgundy/10 bg-paper px-5 pb-5 md:hidden" aria-label="Mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobile(false)} className="block border-b border-burgundy/10 py-4 font-display text-2xl text-burgundy">{l.label}</a>
          ))}
        </nav>
      )}
      <style>{`@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.25)}100%{transform:scale(1)}}`}</style>
    </header>
  );
}
