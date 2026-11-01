"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer.js";

export async function signOut() {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
