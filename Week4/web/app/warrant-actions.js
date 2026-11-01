"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabaseServer.js";

// Issue a warrant — an EXPLICIT community action. Requires: a signed-in member
// of the body, quorum met, and no warrant already active for the provider.
// RLS independently enforces membership + issued_by = self + synthetic.
export async function issueWarrant(formData) {
  const reason = (formData.get("reason") || "").toString().trim().slice(0, 2000) || null;
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: bodies } = await supabase
    .from("community_bodies")
    .select("id, provider_id, quorum")
    .order("created_at", { ascending: true })
    .limit(1);
  const body = bodies?.[0];
  if (!body || !body.provider_id) return;

  const { data: mine } = await supabase
    .from("memberships")
    .select("id")
    .eq("body_id", body.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mine) return; // not a member

  const { count } = await supabase
    .from("memberships")
    .select("id", { count: "exact", head: true })
    .eq("body_id", body.id);
  if ((count ?? 0) < body.quorum) return; // quorum not met

  const { data: active } = await supabase
    .from("warrants")
    .select("id")
    .eq("provider_id", body.provider_id)
    .eq("status", "issued")
    .maybeSingle();
  if (active) return; // already an active warrant

  const { data: w, error } = await supabase
    .from("warrants")
    .insert({
      provider_id: body.provider_id,
      body_id: body.id,
      status: "issued",
      reason,
      issued_by: user.id,
      synthetic: true,
    })
    .select("id")
    .single();

  if (!error && w) {
    // Append-only receipt ("enforce, then prove").
    await supabase.from("warrant_events").insert({
      warrant_id: w.id,
      event_type: "issued",
      actor: user.id,
      note: reason,
    });
  }

  revalidatePath("/warrants");
}

// Revoke an active warrant — one step. Restricted (by RLS) to body members.
export async function revokeWarrant(formData) {
  const warrantId = formData.get("warrantId");
  const supabase = getSupabaseServerClient();
  if (!supabase || !warrantId) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("warrants")
    .update({
      status: "revoked",
      revoked_by: user.id,
      revoked_at: new Date().toISOString(),
    })
    .eq("id", warrantId)
    .eq("status", "issued");

  if (!error) {
    await supabase.from("warrant_events").insert({
      warrant_id: warrantId,
      event_type: "revoked",
      actor: user.id,
    });
  }

  revalidatePath("/warrants");
}
