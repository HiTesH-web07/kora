import { NextResponse } from "next/server";
import { clearSessionCookie, isSignedIn, makeSessionCookie, verifyPassword } from "@/lib/adminAuth";
import { readSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return NextResponse.json({ signedIn: isSignedIn(req) });
}

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !verifyPassword(password, readSettings().adminPasswordHash)) {
    return NextResponse.json({ error: "That password doesn't match." }, { status: 401 });
  }
  const res = NextResponse.json({ signedIn: true });
  res.headers.set("Set-Cookie", makeSessionCookie());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ signedIn: false });
  res.headers.set("Set-Cookie", clearSessionCookie());
  return res;
}
