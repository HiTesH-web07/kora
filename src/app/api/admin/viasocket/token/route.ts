import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/adminAuth";
import { viasocketUser } from "@/lib/automations";

export const dynamic = "force-dynamic";

/** A short-lived token for the signed-in admin's embedded viaSocket screens. Signed on the server. */
export async function GET(req: Request) {
  if (!isSignedIn(req)) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const user = viasocketUser();
  if (!user) return NextResponse.json({ configured: false });
  try {
    return NextResponse.json({ configured: true, token: await user.token() });
  } catch (err) {
    return NextResponse.json({ configured: true, error: err instanceof Error ? err.message : "Could not create a token." }, { status: 502 });
  }
}
