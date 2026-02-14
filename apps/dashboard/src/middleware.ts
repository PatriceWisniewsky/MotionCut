import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Im lokalen Modus: keine Auth-Checks, alles durchlassen
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isLocal = !supabaseUrl || supabaseUrl.includes("YOUR_PROJECT_ID") || supabaseUrl === "";

  if (isLocal) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
