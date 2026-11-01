import { getSupabaseServerClient } from "@/lib/supabaseServer.js";
import { PROVISIONAL_LABEL } from "@/lib/config.js";
import BodyView from "@/components/BodyView.jsx";

export const dynamic = "force-dynamic";

export default async function BodyPage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return <BodyView body={null} provisionalLabel={PROVISIONAL_LABEL} />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bodies } = await supabase
    .from("community_bodies")
    .select("id, name, quorum, provider_id")
    .order("created_at", { ascending: true })
    .limit(1);

  const body = bodies?.[0] ?? null;
  if (!body) {
    return (
      <BodyView
        body={null}
        user={user ? { email: user.email } : null}
        provisionalLabel={PROVISIONAL_LABEL}
      />
    );
  }

  let providerName = null;
  if (body.provider_id) {
    const { data: prov } = await supabase
      .from("providers")
      .select("name")
      .eq("id", body.provider_id)
      .maybeSingle();
    providerName = prov?.name ?? null;
  }

  // Membership data is readable only to signed-in users (RLS), so counts show
  // once logged in.
  let memberCount = 0;
  let isMember = false;
  if (user) {
    const { count } = await supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("body_id", body.id);
    memberCount = count ?? 0;

    const { data: mine } = await supabase
      .from("memberships")
      .select("id")
      .eq("body_id", body.id)
      .eq("user_id", user.id)
      .maybeSingle();
    isMember = Boolean(mine);
  }

  return (
    <BodyView
      body={body}
      providerName={providerName}
      user={user ? { email: user.email } : null}
      memberCount={memberCount}
      isMember={isMember}
      provisionalLabel={PROVISIONAL_LABEL}
    />
  );
}
