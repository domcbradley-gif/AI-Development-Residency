import { getSupabaseServerClient } from "@/lib/supabaseServer.js";
import { summarizeFunding } from "@/lib/funding.js";
import { FUNDER_CAP_FRACTION, PROVISIONAL_LABEL } from "@/lib/config.js";
import FundingView from "@/components/FundingView.jsx";

export const dynamic = "force-dynamic";

export default async function FundingPage() {
  const supabase = getSupabaseServerClient();
  const empty = summarizeFunding([], FUNDER_CAP_FRACTION);
  if (!supabase) {
    return <FundingView summary={empty} conflicts={[]} provisionalLabel={PROVISIONAL_LABEL} />;
  }

  const [{ data: sources }, { data: conflicts }] = await Promise.all([
    supabase.from("funding_sources").select("id, name, amount, from_watched"),
    supabase
      .from("conflict_register")
      .select("id, description")
      .order("disclosed_at", { ascending: false }),
  ]);

  const summary = summarizeFunding(sources ?? [], FUNDER_CAP_FRACTION);
  return (
    <FundingView
      summary={summary}
      conflicts={conflicts ?? []}
      provisionalLabel={PROVISIONAL_LABEL}
    />
  );
}
