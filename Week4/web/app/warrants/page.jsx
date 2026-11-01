import { getSupabaseServerClient } from "@/lib/supabaseServer.js";
import WarrantsView from "@/components/WarrantsView.jsx";

export const dynamic = "force-dynamic";

export default async function WarrantsPage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return <WarrantsView provider={null} warrants={[]} />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: providers } = await supabase
    .from("providers")
    .select("id, name")
    .order("created_at", { ascending: true })
    .limit(1);
  const provider = providers?.[0] ?? null;

  const { data: bodies } = await supabase
    .from("community_bodies")
    .select("id, name, quorum, provider_id")
    .order("created_at", { ascending: true })
    .limit(1);
  const body = bodies?.[0] ?? null;

  let warrants = [];
  if (provider) {
    const { data } = await supabase
      .from("warrants")
      .select("id, status, reason, issued_at, revoked_at, body_id")
      .eq("provider_id", provider.id)
      .order("issued_at", { ascending: false });
    warrants = data ?? [];
  }

  let isMember = false;
  let memberCount = 0;
  if (user && body) {
    const { data: mine } = await supabase
      .from("memberships")
      .select("id")
      .eq("body_id", body.id)
      .eq("user_id", user.id)
      .maybeSingle();
    isMember = Boolean(mine);
    const { count } = await supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("body_id", body.id);
    memberCount = count ?? 0;
  }

  const activeWarrant = warrants.find((w) => w.status === "issued") ?? null;

  return (
    <WarrantsView
      provider={provider}
      warrants={warrants}
      activeWarrant={activeWarrant}
      user={user ? { email: user.email } : null}
      isMember={isMember}
      memberCount={memberCount}
      quorum={body?.quorum ?? null}
    />
  );
}
