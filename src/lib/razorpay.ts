import crypto from "crypto";

/** Verifies X-Razorpay-Signature: HMAC SHA256 of the raw body using the webhook secret. */
export function verifyRazorpaySignature(rawBody: string, signature: string | null, secret: string | undefined): boolean {
  if (!signature || !secret) return false;
  const expected = Buffer.from(crypto.createHmac("sha256", secret).update(rawBody).digest("hex"), "utf8");
  const given = Buffer.from(signature, "utf8");
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
