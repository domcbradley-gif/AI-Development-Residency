import { describe, expect, it } from "vitest";
import { computeGap } from "./gap.js";

const official = [
  { category: "heating", reported_summary: "All fine", source: "Inspection" },
  { category: "mold", reported_summary: "No complaints", source: "Inspection" },
];

describe("computeGap", () => {
  it("flags a mismatch when an official claim meets resident accounts", () => {
    const rows = computeGap(official, { heating: 4 }, 3);
    const heating = rows.find((r) => r.category === "heating");
    expect(heating.mismatch).toBe(true);
    expect(heating.displayCount).toBe(4); // 4 >= minDisplay, shown exactly
    expect(heating.masked).toBe(false);
  });

  it("masks a small count for exposure protection", () => {
    const rows = computeGap(official, { mold: 1 }, 3);
    const mold = rows.find((r) => r.category === "mold");
    expect(mold.masked).toBe(true);
    expect(mold.displayCount).toBe(null); // shown as "a few", not "1"
    expect(mold.mismatch).toBe(true); // still a real discrepancy
  });

  it("no mismatch when residents have not raised a category", () => {
    const rows = computeGap(official, {}, 3);
    expect(rows.every((r) => r.mismatch === false)).toBe(true);
  });

  it("includes resident topics that have no official record", () => {
    const rows = computeGap(official, { elevator: 5 }, 3);
    const elevator = rows.find((r) => r.category === "elevator");
    expect(elevator.official).toBe(null);
    expect(elevator.displayCount).toBe(5);
  });
});
