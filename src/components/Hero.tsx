"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/data/site";
import { Blossom, CurlArrow, Float, Heart } from "./Doodles";

const lines = ["Two friends.", "One little idea.", "A whole lot of sweetness."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const signY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const polY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden bg-cream/60">
      <Float className="left-[2%] bottom-10 hidden w-12 md:block" delay={0.5}><Blossom /></Float>
      <Float className="bottom-16 left-[44%] hidden w-10 md:block" delay={1.5} amp={14}><Blossom color="#D5B77B" center="#762E42" /></Float>
      <Float className="right-[6%] top-10 w-12" delay={1}><Blossom color="#762E42" center="#F5E6D9" /></Float>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-12 md:grid-cols-12 md:gap-6 md:px-8 md:pb-28 md:pt-20">
        <div className="relative z-10 md:col-span-7">
          <h1 className="font-display text-[3.1rem] font-medium leading-[0.98] text-burgundy sm:text-7xl lg:text-[6.4rem]" aria-label={site.tagline}>
            {lines.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${i === 1 ? "italic md:ml-14" : ""} ${i === 2 ? "md:ml-4" : ""}`}
                  initial={{ y: "105%" }} animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}
                >{l}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="mt-7 max-w-md text-lg leading-relaxed text-cocoa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
            {site.subline}
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }}>
            <a href="#menu" className="btn-primary">Explore the menu</a>
            <a href="#story" className="btn-ghost">Our story</a>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:col-span-5 md:max-w-none">
          <motion.div style={{ y: signY }} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="relative mx-auto aspect-square w-[88%] overflow-hidden rounded-full border-[6px] border-gold/70 shadow-[0_30px_60px_-25px_rgba(118,46,66,.55)]">
            <img src="/images/stall-founders.webp" alt="The Kōra Bakehouse stall, framed in pink and white flowers under a glowing round sign" className="h-full w-full object-cover" style={{ objectPosition: "50% 22%" }} fetchPriority="high" />
          </motion.div>
          <motion.div style={{ y: polY }} className="absolute -bottom-6 -left-2 w-[42%] md:-left-8">
            <div className="polaroid rotate-[-6deg]">
              <div className="aspect-[4/5] overflow-hidden"><img src="/images/waffle-cone.webp" alt="A chocolate-striped waffle in a Kōra paper cone" className="h-full w-full object-cover" /></div>
              <p className="hand mt-1 text-center text-xl text-burgundy">Oreo + waffle</p>
            </div>
          </motion.div>
          <div className="absolute right-0 -top-4 flex rotate-6 items-start gap-1 whitespace-nowrap text-burgundy md:-right-4">
            <span className="hand text-2xl">made with love</span><Heart className="mt-1 h-5 w-5 shrink-0" />
          </div>
          <CurlArrow className="absolute right-10 top-8 h-12 w-14 rotate-[100deg] text-burgundy/70" />
        </div>
      </div>
    </section>
  );
}
