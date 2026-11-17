"use client";
import { useRef, useState } from "react";
import { Instagram, Play } from "lucide-react";
import { site } from "@/data/site";
import { useConfig } from "@/store/config";

const stills = [
  { src: "/images/little-customer.webp", alt: "A little boy with chocolate on his lips, eating a chocolate-drizzled treat from a plate", cls: "col-span-2 row-span-2 rotate-[-1.5deg]", note: "chocolate first, questions later" },
  { src: "/images/donut-box.webp", alt: "Box of filled sugar donuts", cls: "rotate-2" },
  { src: "/images/waffle-quad.webp", alt: "Four-flavour brownie waffle", cls: "rotate-[-2deg]" },
  { src: "/images/pasta-cup.webp", alt: "Creamy pasta in a Kōra cup", cls: "rotate-1" },
  { src: "/images/birthday-cake.webp", alt: "Marble birthday cake surrounded by golden candle holders", cls: "rotate-[-1deg]" },
];
const reels = [
  { v: "/video/reel-pancakes.mp4", p: "/video/reel-pancakes.jpg", label: "Golden, bite-sized pancakes coming off the pan" },
  { v: "/video/reel-stall.mp4", p: "/video/reel-stall.jpg", label: "A cup of treats at the Kōra stall" },
  { v: "/video/reel-puffs.mp4", p: "/video/reel-puffs.jpg", label: "Biscoff puffs" },
];

function Reel({ v, p, label }: { v: string; p: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const el = ref.current; if (!el) return;
    if (el.paused) { el.play().then(() => setPlaying(true)).catch(() => {}); } else { el.pause(); setPlaying(false); }
  };
  return (
    <button onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} video: ${label}`} className="relative aspect-[9/16] w-52 shrink-0 overflow-hidden bg-cocoa md:w-full">
      <video ref={ref} src={v} poster={p} muted loop playsInline preload="none" className="h-full w-full object-cover" />
      {!playing && <span className="absolute inset-0 flex items-center justify-center bg-cocoa/10"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper/90 text-burgundy"><Play size={22} fill="currentColor" /></span></span>}
    </button>
  );
}

export function Moments() {
  const cfg = useConfig();
  return (
    <section id="moments" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-5xl font-medium leading-none text-burgundy md:text-7xl">Little moments from Kora</h2>
          <a href={cfg.instagramUrl || site.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost self-start"><Instagram size={18} /> Follow {site.instagramHandle}</a>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="grid grid-cols-2 gap-4 md:col-span-8">
            {stills.map((s) => (
              <div key={s.src} className={`relative overflow-hidden bg-cream ${s.cls}`}>
                <img src={s.src} alt={s.alt} loading="lazy" className="h-full w-full object-cover" />
                {"note" in s && s.note && <span className="hand absolute bottom-4 left-4 -rotate-2 bg-paper/95 px-3 py-1 text-2xl text-burgundy">{s.note}</span>}
              </div>
            ))}
          </div>
          <div className="scrollbar-none -mx-5 flex gap-4 overflow-x-auto px-5 md:col-span-4 md:mx-0 md:grid md:grid-cols-1 md:overflow-visible md:px-0">
            {reels.slice(0, 2).map((r) => <Reel key={r.v} {...r} />)}
            <div className="md:hidden"><Reel {...reels[2]} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
