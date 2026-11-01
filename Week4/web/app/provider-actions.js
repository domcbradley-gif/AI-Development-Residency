"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabaseServer.js";

// STUB (ADR 0007): provider record intake (5.1) and the outcome stub (5.2).
// A signed-in user adds an entry to the official record for the provider. An
// "outcome" category is how the minimal outcome stub is captured, reusing the
// official_records table rather than a separate outcomes model.
export async function addProviderRecord(formData) {
  const category = (formData.get("category") || "").toString().trim().slice(0, 80);
  const summary = (formData.get("summary") || "").toString().trim().slice(0, 2000);
  const source =
    (formData.get("source") || "").toString().trim().slice(0, 120) ||
    "Provider self-report";
  if (!category || !summary) return;

  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Role-gating (ADR 0007): only provider-role users may add to the record.
  // RLS enforces this too; this is the friendly early return.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "provider") return;

  const { data: providers } = await supabase
    .from("providers")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1);
  const provider = providers?.[0];
  if (!provider) return;

  await supabase.from("official_records").insert({
    provider_id: provider.id,
    source,
    category,
    reported_summary: summary,
    synthetic: true,
  });

  revalidatePath("/provider");
  revalidatePath("/gap");
}
