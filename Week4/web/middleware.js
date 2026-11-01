import { updateSession } from "@/lib/supabaseMiddleware.js";

export async function middleware(request) {
  return await updateSession(request);
}

// Run on all paths except static assets.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
