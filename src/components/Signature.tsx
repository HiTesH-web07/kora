"use client";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { AddButton } from "./AddButton";
import { Blossom } from "./Doodles";

const feature = products.filter((p) => p.signature);
const shout = ["Soft cookies. Rich chocolate. Pure happiness.", "", ""];

export function Signature() {
  return (
    <section className="relative overflow-hidden bg-rosewater px-5 py-24 md:px-8 md:py-36">
      <Blossom className="absolute -right-10 top-10 w-40 opacity-40" />
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-5xl font-medium leading-none text-burgundy md:text-7xl">Our signatures</h2>
        <div className="mt-16 space-y-24 md:space-y-36">
          {feature.map((p, i) => {
            const reverse = i === 1;
            const small = i === 2;
            return (
              <motion.div key={p.id} className="grid items-center gap-8 md:grid-cols-12 md:gap-12" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
                <div className={`${small ? "md:col-span-5" : "md:col-span-7"} ${reverse ? "md:order-2" : ""}`}>
                  <div className={`overflow-hidden ${small ? "aspect-[4/5]" : "aspect-square md:aspect-[6/5]"} ${i === 0 ? "rotate-[-1deg]" : ""}`}>
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: p.imagePosition }} />
                  </div>
                </div>
                <div className={`${small ? "md:col-span-7" : "md:col-span-5"} ${reverse ? "md:order-1 md:text-right" : ""}`}>
                  {i === 2 && <p className="hand mb-3 text-3xl text-burgundy/80">{shout[0]}</p>}
                  <h3 className="font-display text-4xl font-medium leading-tight text-burgundy md:text-6xl">{p.name}</h3>
                  <p className={`mt-5 max-w-sm text-lg leading-relaxed text-cocoa ${reverse ? "md:ml-auto" : ""}`}>{p.description}</p>
                  <div className={`mt-7 flex items-center gap-5 ${reverse ? "md:justify-end" : ""}`}>
                    <span className="font-display text-3xl text-burgundy">{formatPrice(p.price)}</span>
                    <AddButton id={p.id} name={p.name} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
