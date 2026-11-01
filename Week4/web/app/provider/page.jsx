import { getSupabaseServerClient } from "@/lib/supabaseServer.js";
import { summarizeFunding } from "@/lib/funding.js";
import { FUNDER_CAP_FRACTION } from "@/lib/config.js";
import ProviderView from "@/components/ProviderView.jsx";

export const dynamic = "force-dynamic";

export default async function ProviderPage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return <ProviderView provider={null} events={[]} outcomes={[]} independence={[]} />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isProvider = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isProvider = profile?.role === "provider";
  }

  const { data: providers } = await supabase
    .from("providers")
    .select("id, name")
    .order("created_at", { ascending: true })
    .limit(1);
  const provider = providers?.[0] ?? null;
  if (!provider) {
    return <ProviderView provider={null} events={[]} outcomes={[]} independence={[]} />;
  }

  const { data: issued } = await supabase
    .from("warrants")
    .select("id, issued_at")
    .eq("provider_id", provider.id)
    .eq("status", "issued")
    .order("issued_at", { ascending: false });
  const activeWarrant = issued?.[0] ?? null;

  const { data: outcomes } = await supabase
    .from("official_records")
    .select("id, reported_summary, source, record_date")
    .eq("provider_id", provider.id)
    .eq("category", "outcome")
    .order("created_at", { ascending: false });

  // Receipts for this provider's warrants.
  const { data: warrantIds } = await supabase
    .from("warrants")
    .select("id")
    .eq("provider_id", provider.id);
  const ids = (warrantIds ?? []).map((w) => w.id);
  let events = [];
  if (ids.length > 0) {
    const { data } = await supabase
      .from("warrant_events")
      .select("id, event_type, note, created_at")
      .in("warrant_id", ids)
      .order("created_at", { ascending: false })
      .limit(20);
    events = data ?? [];
  }

  // Independence re-check (ADR 0007, 4.3): computed from existing data.
  const { data: funders } = await supabase
    .from("funding_sources")
    .select("amount, from_watched");
  const funding = summarizeFunding(funders ?? [], FUNDER_CAP_FRACTION);

  const { data: bodies } = await supabase
    .from("community_bodies")
    .select("quorum")
    .order("created_at", { ascending: true })
    .limit(1);
  const quorum = bodies?.[0]?.quorum ?? null;

  const independence = [
    { label: "Membership is self-organized (no organization selects members)", ok: true },
    { label: "No single funder is over the cap", ok: !funding.anyOverCap },
    { label: "No money from the watched", ok: !funding.anyFromWatched },
    { label: "A quorum is set for the community body", ok: Boolean(quorum && quorum >= 1) },
  ];

  return (
    <ProviderView
      provider={provider}
      activeWarrant={activeWarrant}
      events={events}
      outcomes={outcomes ?? []}
      independence={independence}
      user={user ? { email: user.email } : null}
      isProvider={isProvider}
    />
  );
}
