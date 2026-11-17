"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/data/site";
import { Polaroid } from "./Polaroid";
import { Heart, Squiggle } from "./Doodles";

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-20, 70]);
  const y3 = useTransform(scrollYProgress, [0, 1], [70, -30]);
  const { story } = site;

  return (
    <section id="story" ref={ref} className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12">
        <motion.div className="md:col-span-5 md:pt-10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
          <h2 className="font-display text-5xl font-medium leading-[1.02] text-burgundy md:text-7xl">{story.heading}</h2>
          <Squiggle className="mt-5 h-5 w-40 text-gold" />
          <p className="mt-8 max-w-md font-display text-2xl leading-[1.45] text-cocoa md:text-[1.65rem]">{story.body}</p>
          <ul className="mt-10 space-y-2">
            {story.notes.map((n) => (
              <li key={n} className="hand flex items-center gap-2 text-3xl text-burgundy"><Heart className="h-4 w-4 shrink-0 text-blush" />{n}</li>
            ))}
          </ul>
        </motion.div>

        <div className="relative min-h-[34rem] md:col-span-7 md:min-h-[50rem]">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-0 w-[62%] max-w-sm">
            <Polaroid src="/images/stall-founders.webp" alt="Two friends behind the Kōra stall counter, smiling" caption="behind the counter" rotate={-4} position="50% 66%" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute right-0 top-24 w-[46%] max-w-[16rem] md:top-10">
            <Polaroid src="/images/cookies-poster.webp" alt="Chocolate-drizzled cookies on a wooden tray with Kōra wrapping paper" caption="soft cookies, rich chocolate" rotate={5} position="50% 60%" ratio="aspect-square" />
          </motion.div>
          <motion.div style={{ y: y3 }} className="absolute bottom-0 right-[8%] w-[52%] max-w-[17rem] md:right-[18%]">
            <Polaroid src="/images/donut-pink.webp" alt="Stacked sugar donuts oozing chocolate against a pink backdrop" caption="the first bite" rotate={-2} position="70% 40%" ratio="aspect-square" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
