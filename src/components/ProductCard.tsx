import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { AddButton } from "./AddButton";

const ratio = { portrait: "aspect-[4/5]", square: "aspect-square", wide: "aspect-[5/4]" } as const;

export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="group">
      <div className={`relative overflow-hidden bg-cream ${ratio[p.aspect ?? "square"]}`}>
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" style={{ objectPosition: p.imagePosition }} />
        <span className="hand absolute left-3 top-3 -rotate-2 bg-paper/95 px-2.5 py-0.5 text-xl text-burgundy">{p.category}</span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-medium leading-tight text-burgundy">{p.name}</h3>
          <p className="mt-1.5 max-w-xs text-[0.95rem] leading-relaxed text-cocoa/85">{p.description}</p>
          <p className="mt-2 font-medium text-cocoa">{formatPrice(p.price)}</p>
        </div>
        <div className="shrink-0 pt-1"><AddButton id={p.id} name={p.name} /></div>
      </div>
    </article>
  );
}
