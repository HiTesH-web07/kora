import crypto from "crypto";
import { readSettings, writeSettings } from "./settings";

const COOKIE = "kora_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export const hashPassword = (password: string, salt = crypto.randomBytes(16).toString("hex")) =>
  `scrypt:${salt}:${crypto.scryptSync(password, salt, 32).toString("hex")}`;

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hex] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hex) return false;
  const a = Buffer.from(hex, "hex");
  const b = crypto.scryptSync(password, salt, a.length);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Session secret is generated once and kept with the settings. */
function secret(): string {
  const s = readSettings();
  if (s.sessionSecret) return s.sessionSecret;
  return writeSettings({ sessionSecret: crypto.randomBytes(32).toString("hex") }).sessionSecret;
}

export function makeSessionCookie(): string {
  const expires = Date.now() + MAX_AGE * 1000;
  const sig = crypto.createHmac("sha256", secret()).update(String(expires)).digest("hex");
  return `${COOKIE}=${expires}.${sig}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${MAX_AGE}`;
}
export const clearSessionCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`;

export function isSignedIn(req: Request): boolean {
  const raw = req.headers.get("cookie") || "";
  const token = raw.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  const expected = crypto.createHmac("sha256", secret()).update(expires).digest("hex");
  return expected.length === sig.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
