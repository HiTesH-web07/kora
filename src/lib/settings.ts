import fs from "fs";
import path from "path";
import { DEFAULT_ADMIN } from "@/data/adminDefault";

/**
 * Runtime settings, editable from /admin and stored as JSON under DATA_DIR so they
 * survive redeploys. Env vars act as fallbacks only; whatever is saved in the admin
 * page wins. Secrets never leave the server (the admin API returns masked values).
 */
export interface Settings {
  whatsappNumber: string;
  instagramUrl: string;
  location: string;
  hours: string;
  orderMode: "mock" | "live";
  viasocketWebhookUrl: string;
  viasocketAuthHeaderName: string;
  viasocketAuthHeaderValue: string;
  razorpayWebhookSecret: string;
  viasocketOrgId: string;
  viasocketProjectId: string;
  viasocketEmbedSecret: string;
  adminPasswordHash: string;
  sessionSecret: string;
}

export const DATA_PATH = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "settings.json");

const defaults = (): Settings => ({
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919301748255").replace(/\D/g, ""), // 91 = India
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/kora_bakehouse/",
  location: "Mahalaxmi Nagar Main Gate, Inside The Bro Code Chopati",
  hours: "Open 4 PM to 12 AM",
  orderMode: process.env.ORDER_MODE === "live" ? "live" : "mock",
  viasocketWebhookUrl: process.env.VIASOCKET_WEBHOOK_URL || "",
  viasocketAuthHeaderName: process.env.VIASOCKET_AUTH_HEADER_NAME || "",
  viasocketAuthHeaderValue: process.env.VIASOCKET_AUTH_HEADER_VALUE || "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  viasocketOrgId: process.env.VIASOCKET_ORG_ID || "",
  viasocketProjectId: process.env.VIASOCKET_PROJECT_ID || "",
  viasocketEmbedSecret: process.env.VIASOCKET_EMBED_SECRET || "",
  adminPasswordHash: DEFAULT_ADMIN.passwordHash,
  sessionSecret: "",
});

export function readSettings(): Settings {
  const base = defaults();
  try {
    const saved = JSON.parse(fs.readFileSync(FILE, "utf8")) as Partial<Settings>;
    const next = { ...base, ...saved };
    // A blank saved value falls back to the built-in contact details instead of hiding them.
    if (!next.whatsappNumber) next.whatsappNumber = base.whatsappNumber;
    if (!next.location) next.location = base.location;
    if (!next.hours) next.hours = base.hours;
    return next;
  } catch {
    return base; // not saved yet, or the file is unreadable
  }
}

export function writeSettings(patch: Partial<Settings>): Settings {
  const next = { ...readSettings(), ...patch };
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2), { mode: 0o600 });
  return next;
}

/** Safe to send to the browser and to render in the public site. */
export function publicSettings() {
  const s = readSettings();
  return {
    whatsappNumber: s.whatsappNumber.replace(/\D/g, ""),
    instagramUrl: s.instagramUrl,
    location: s.location,
    hours: s.hours,
  };
}
export type PublicSettings = ReturnType<typeof publicSettings>;

/** Admin view: secrets replaced by a "configured" flag. */
export function adminView() {
  const s = readSettings();
  return {
    whatsappNumber: s.whatsappNumber,
    instagramUrl: s.instagramUrl,
    location: s.location,
    hours: s.hours,
    orderMode: s.orderMode,
    viasocketWebhookUrl: s.viasocketWebhookUrl,
    viasocketAuthHeaderName: s.viasocketAuthHeaderName,
    viasocketAuthHeaderSet: s.viasocketAuthHeaderValue.length > 0,
    razorpaySecretSet: s.razorpayWebhookSecret.length > 0,
    viasocketOrgId: s.viasocketOrgId,
    viasocketProjectId: s.viasocketProjectId,
    viasocketSecretSet: s.viasocketEmbedSecret.length > 0,
    storageDir: DIR,
  };
}
