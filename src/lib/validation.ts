import type { CustomerInput } from "./types";

export type FieldErrors = Partial<Record<keyof CustomerInput, string>>;

export const normalizePhone = (v: string) => v.replace(/[\s\-()]/g, "");

export function validateCustomer(c: CustomerInput): FieldErrors {
  const e: FieldErrors = {};
  if (c.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^\+?\d{10,15}$/.test(normalizePhone(c.whatsapp))) e.whatsapp = "Enter a valid WhatsApp number (10 to 15 digits).";
  if (c.address.trim().length < 10) e.address = "Enter your full delivery address (flat, area, city, pincode).";
  if ((c.notes ?? "").length > 300) e.notes = "Keep notes under 300 characters.";
  return e;
}
