"use client";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { AddButton } from "./AddButton";

const gifts = ["lotus-pink-gift", "lotus-green-gift", "jar-hamper", "marble-cake"].map((id) => products.find((p) => p.id === id)!);
const occasions = ["Birthdays", "Festive hampers", "Thank-yous", "Just because"];

export function Gifting() {
  return (
    <section id="gifting" className="bg-burgundy px-5 py-24 text-cream md:px-8 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-5xl font-medium leading-[1.02] md:text-6xl">Some moments deserve a little something sweet.</h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-cream/85">Chocolate assortments, cookie jars and cakes, packed so beautifully that opening them is part of the gift.</p>
          <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-1">
            {occasions.map((o) => <li key={o} className="hand text-3xl text-blush">{o}</li>)}
          </ul>
        </div>
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 md:col-span-8">
          {gifts.map((g, i) => (
            <motion.article key={g.id} className={i % 2 ? "sm:mt-16" : ""} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: (i % 2) * 0.12 }}>
              <div className="aspect-[5/4] overflow-hidden bg-cocoa">
                <img src={g.image} alt={g.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" style={{ objectPosition: g.imagePosition }} />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl leading-tight">{g.name}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-cream/75">{g.description}</p>
                  <p className="mt-2 font-medium text-gold">{formatPrice(g.price)}</p>
                </div>
                <div className="shrink-0 pt-1"><AddButton id={g.id} name={g.name} tone="light" /></div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
