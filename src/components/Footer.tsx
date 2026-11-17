"use client";
import { Instagram, MapPin, MessageCircle, Clock, Phone } from "lucide-react";
import { site } from "@/data/site";
import { CATEGORIES } from "@/data/products";
import { generalWhatsAppLink } from "@/lib/whatsapp";
import { useConfig } from "@/store/config";
import { Logo } from "./Nav";

/** 919301748255 -> +91 93017 48255 */
const prettyPhone = (d: string) => (/^91\d{10}$/.test(d) ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : `+${d}`);

export function Footer() {
  const cfg = useConfig();
  const wa = generalWhatsAppLink(cfg.whatsappNumber);
  return (
    <footer className="bg-cocoa px-5 pb-10 pt-20 text-cream md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="hand mt-5 text-3xl text-blush">{site.subline}</p>
        </div>
        <div className="space-y-4 text-[0.95rem] md:col-span-4">
          <p className="font-display text-2xl">Say hello</p>
          <a href={cfg.instagramUrl || site.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold"><Instagram size={18} /> {site.instagramHandle}</a>
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold"><MessageCircle size={18} /> WhatsApp {prettyPhone(cfg.whatsappNumber)}</a>
          ) : (
            <p className="flex items-center gap-3 text-cream/70"><MessageCircle size={18} /> WhatsApp number coming soon</p>
          )}
          {cfg.whatsappNumber && <a href={`tel:+${cfg.whatsappNumber}`} className="flex items-center gap-3 hover:text-gold"><Phone size={18} /> Call {prettyPhone(cfg.whatsappNumber)}</a>}
          <p className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0" /> {cfg.location || site.location}</p>
          <p className="flex items-start gap-3"><Clock size={18} className="mt-0.5 shrink-0" /> {cfg.hours || "Opening hours: coming soon"}</p>
        </div>
        <div className="md:col-span-3">
          <p className="font-display text-2xl">The menu</p>
          <ul className="mt-4 space-y-2 text-[0.95rem]">
            {CATEGORIES.map((c) => <li key={c}><a href="#menu" className="hover:text-gold">{c}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-7xl border-t border-cream/15 pt-6 text-sm text-cream/60">&copy; {new Date().getFullYear()} Kōra Bakehouse. Made with love.</p>
    </footer>
  );
}
