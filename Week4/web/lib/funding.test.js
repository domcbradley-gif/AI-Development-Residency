import { describe, expect, it } from "vitest";
import { summarizeFunding } from "./funding.js";

describe("summarizeFunding", () => {
  it("computes shares and totals", () => {
    const s = summarizeFunding([{ amount: 25 }, { amount: 75 }], 0.25);
    expect(s.total).toBe(100);
    expect(s.rows[1].share).toBeCloseTo(0.75);
  });
  it("flags a funder over the cap", () => {
    const s = summarizeFunding([{ amount: 60 }, { amount: 40 }], 0.25);
    expect(s.anyOverCap).toBe(true);
  });
  it("flags money from the watched", () => {
    const s = summarizeFunding([{ amount: 10, from_watched: true }], 0.25);
    expect(s.anyFromWatched).toBe(true);
  });
  it("handles an empty list without dividing by zero", () => {
    const s = summarizeFunding([], 0.25);
    expect(s.total).toBe(0);
    expect(s.anyOverCap).toBe(false);
  });
});
