"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, products } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function Menu() {
  const [cat, setCat] = useState<string>("All");
  const shown = cat === "All" ? products : products.filter((p) => p.category === cat);
  const tabs = ["All", ...CATEGORIES.filter((c) => products.some((p) => p.category === c))];

  return (
    <section id="menu" className="bg-cream/50 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-5xl font-medium leading-none text-burgundy md:text-7xl">What&rsquo;s baking</h2>
          <p className="hand max-w-xs text-2xl text-burgundy/80 md:text-right">Sample menu and prices while the real one is being finalised.</p>
        </div>

        <div role="tablist" aria-label="Menu categories" className="scrollbar-none -mx-5 mt-10 flex gap-7 overflow-x-auto border-b border-burgundy/15 px-5 md:mx-0 md:px-0">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={cat === t} onClick={() => setCat(t)}
              className={`relative shrink-0 whitespace-nowrap pb-3 text-base transition-colors ${cat === t ? "text-burgundy" : "text-cocoa/65 hover:text-burgundy"}`}>
              {t}
              {cat === t && <motion.span layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-burgundy" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={cat} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            className="mt-12 gap-x-6 gap-y-12 sm:columns-2 lg:columns-3 [&>*]:mb-12 [&>*]:break-inside-avoid">
            {shown.map((p) => <ProductCard key={p.id} p={p} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
