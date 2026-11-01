// Pure funding-discipline computation — no network, easy to unit test.
// Computes each funder's share of the total and flags two guardrail breaches:
// a single funder over the cap, and any money from "the watched".
export function summarizeFunding(sources = [], capFraction = 0.25) {
  const total = sources.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const rows = sources.map((f) => {
    const amount = Number(f.amount || 0);
    const share = total > 0 ? amount / total : 0;
    return {
      id: f.id,
      name: f.name,
      amount,
      share,
      overCap: share > capFraction,
      fromWatched: Boolean(f.from_watched),
    };
  });
  return {
    total,
    rows,
    capFraction,
    anyOverCap: rows.some((r) => r.overCap),
    anyFromWatched: rows.some((r) => r.fromWatched),
  };
}
