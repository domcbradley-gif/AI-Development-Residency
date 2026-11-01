// Pure "gap" computation — no network, no Supabase, so it is easy to unit test.
//
// The gap sets each OFFICIAL-record claim beside how many RESIDENT accounts touch
// the same category. It deliberately applies NO pass/fail score: it shows both
// sides and flags only where an official claim and residents' accounts disagree.
//
// Exposure protection: a resident-account count below `minDisplay` is masked
// (shown as "a few") rather than as an exact number, so a very small group can't
// be singled out. `minDisplay` is provisional, community-owned config.

export function computeGap(officialRecords = [], topicCounts = {}, minDisplay = 3) {
  const categories = new Set([
    ...officialRecords.map((r) => r.category),
    ...Object.keys(topicCounts),
  ]);

  return [...categories].sort().map((category) => {
    const official =
      officialRecords.find((r) => r.category === category) || null;
    const residentCount = topicCounts[category] || 0;
    const masked = residentCount > 0 && residentCount < minDisplay;

    return {
      category,
      official, // { source, reported_summary, record_date } or null
      residentCount,
      // Exact number only when it is safe to show; otherwise null => "a few".
      displayCount: masked ? null : residentCount,
      masked,
      minDisplay,
      // Factual discrepancy, not a verdict: an official claim exists AND at least
      // one resident account touches the same category.
      mismatch: Boolean(official) && residentCount > 0,
    };
  });
}
