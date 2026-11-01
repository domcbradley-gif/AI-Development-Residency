import { getSupabaseServerClient } from "@/lib/supabaseServer.js";
import { computeGap } from "@/lib/gap.js";
import { GAP_MIN_DISPLAY_COUNT, PROVISIONAL_LABEL } from "@/lib/config.js";
import GapView from "@/components/GapView.jsx";

// Reads live data per request (and the signed-in session), so it is dynamic.
export const dynamic = "force-dynamic";

export default async function GapPage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return <GapView provider={null} rows={[]} provisionalLabel={PROVISIONAL_LABEL} />;
  }

  const { data: providers } = await supabase
    .from("providers")
    .select("id, name, description")
    .order("created_at", { ascending: true })
    .limit(1);

  const provider = providers?.[0] ?? null;
  if (!provider) {
    return <GapView provider={null} rows={[]} provisionalLabel={PROVISIONAL_LABEL} />;
  }

  const [{ data: official }, { data: contribs }] = await Promise.all([
    supabase
      .from("official_records")
      .select("category, reported_summary, source, record_date")
      .eq("provider_id", provider.id),
    // Only the topic column is read — never a contribution body — and it is
    // aggregated here on the server so raw accounts never reach the browser.
    supabase.from("contributions").select("topic"),
  ]);

  const topicCounts = {};
  for (const c of contribs ?? []) {
    if (c.topic) topicCounts[c.topic] = (topicCounts[c.topic] || 0) + 1;
  }

  const rows = computeGap(official ?? [], topicCounts, GAP_MIN_DISPLAY_COUNT);
  return (
    <GapView provider={provider} rows={rows} provisionalLabel={PROVISIONAL_LABEL} />
  );
}
