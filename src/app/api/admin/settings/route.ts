import { NextResponse } from "next/server";
import { hashPassword, isSignedIn } from "@/lib/adminAuth";
import { adminView, writeSettings, type Settings } from "@/lib/settings";
import { activeAutomations } from "@/lib/automations";

export const dynamic = "force-dynamic";
const denied = () => NextResponse.json({ error: "Sign in first." }, { status: 401 });

export async function GET(req: Request) {
  if (!isSignedIn(req)) return denied();
  return NextResponse.json(adminView());
}

export async function PUT(req: Request) {
  if (!isSignedIn(req)) return denied();
  const body = await req.json().catch(() => ({}));
  const patch: Partial<Settings> = {};
  const errors: Record<string, string> = {};

  if (typeof body.whatsappNumber === "string") {
    const digits = body.whatsappNumber.replace(/\D/g, "");
    if (digits && !/^\d{10,15}$/.test(digits)) errors.whatsappNumber = "Use 10 to 15 digits including the country code, e.g. 919876543210.";
    else patch.whatsappNumber = digits;
  }
  if (typeof body.instagramUrl === "string") {
    if (body.instagramUrl && !/^https:\/\//.test(body.instagramUrl)) errors.instagramUrl = "Must start with https://";
    else patch.instagramUrl = body.instagramUrl.trim();
  }
  if (typeof body.location === "string") patch.location = body.location.trim().slice(0, 300);
  if (typeof body.hours === "string") patch.hours = body.hours.trim().slice(0, 300);
  if (body.orderMode === "mock" || body.orderMode === "live") patch.orderMode = body.orderMode;
  if (typeof body.viasocketWebhookUrl === "string") {
    if (body.viasocketWebhookUrl && !/^https:\/\//.test(body.viasocketWebhookUrl)) errors.viasocketWebhookUrl = "Must start with https://";
    else patch.viasocketWebhookUrl = body.viasocketWebhookUrl.trim();
  }
  if (typeof body.viasocketAuthHeaderName === "string") patch.viasocketAuthHeaderName = body.viasocketAuthHeaderName.trim();
  // Secrets: only overwritten when a new value is sent; an empty string clears them.
  if (typeof body.viasocketAuthHeaderValue === "string") patch.viasocketAuthHeaderValue = body.viasocketAuthHeaderValue;
  if (typeof body.razorpayWebhookSecret === "string") patch.razorpayWebhookSecret = body.razorpayWebhookSecret;
  if (typeof body.viasocketOrgId === "string") patch.viasocketOrgId = body.viasocketOrgId.trim();
  if (typeof body.viasocketProjectId === "string") patch.viasocketProjectId = body.viasocketProjectId.trim();
  if (typeof body.viasocketEmbedSecret === "string" && body.viasocketEmbedSecret) patch.viasocketEmbedSecret = body.viasocketEmbedSecret.trim();
  if (typeof body.newPassword === "string" && body.newPassword.length > 0) {
    if (body.newPassword.length < 8) errors.newPassword = "Use at least 8 characters.";
    else patch.adminPasswordHash = hashPassword(body.newPassword);
  }
  if (body.orderMode === "live" && !(patch.viasocketWebhookUrl ?? "") && activeAutomations().length === 0) {
    errors.orderMode = "Publish at least one automation (or add a webhook URL) before switching to live orders.";
  }

  if (Object.keys(errors).length) return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });
  writeSettings(patch);
  return NextResponse.json({ saved: true, settings: adminView() });
}
