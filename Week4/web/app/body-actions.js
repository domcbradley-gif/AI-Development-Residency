"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabaseServer.js";

export async function joinBody(formData) {
  const bodyId = formData.get("bodyId");
  const supabase = getSupabaseServerClient();
  if (!supabase || !bodyId) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  // RLS enforces that a user can only add THEMSELVES (no org-run selection).
  await supabase.from("memberships").insert({ body_id: bodyId, user_id: user.id });
  revalidatePath("/body");
}

export async function leaveBody(formData) {
  const bodyId = formData.get("bodyId");
  const supabase = getSupabaseServerClient();
  if (!supabase || !bodyId) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("memberships")
    .delete()
    .eq("body_id", bodyId)
    .eq("user_id", user.id);
  revalidatePath("/body");
}
