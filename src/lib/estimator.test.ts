import { describe, it, expect } from "vitest";
import {
  BRICKS_PER_SQFT_5INCH,
  BRICKS_PER_SQFT_10INCH,
  BRICK_ROUND_TO,
  CEMENT_BAG_CFT,
  DRY_VOLUME_FACTOR,
  cap,
  computeBricks,
  computeConcrete,
  computeCft,
  formatLocalizedNumber,
  parseLocalizedNumber,
  roundUpTo,
  toFiniteNumber,
  validatePositive,
} from "./estimator";

describe("toFiniteNumber", () => {
  it("returns 0 for null, undefined and empty string", () => {
    expect(toFiniteNumber(null)).toBe(0);
    expect(toFiniteNumber(undefined)).toBe(0);
    expect(toFiniteNumber("")).toBe(0);
    expect(toFiniteNumber("   ")).toBe(0);
  });

  it("returns 0 for NaN, Infinity, and -Infinity", () => {
    expect(toFiniteNumber(NaN)).toBe(0);
    expect(toFiniteNumber(Infinity)).toBe(0);
    expect(toFiniteNumber(-Infinity)).toBe(0);
    expect(toFiniteNumber("not a number")).toBe(0);
  });

  it("returns 0 for negative numbers", () => {
    expect(toFiniteNumber(-1)).toBe(0);
    expect(toFiniteNumber(-100.5)).toBe(0);
  });

  it("parses string numbers", () => {
    expect(toFiniteNumber("12.5")).toBe(12.5);
    expect(toFiniteNumber("0")).toBe(0);
    expect(toFiniteNumber("100")).toBe(100);
  });

  it("passes through positive finite numbers", () => {
    expect(toFiniteNumber(0)).toBe(0);
    expect(toFiniteNumber(42)).toBe(42);
    expect(toFiniteNumber(1.234)).toBe(1.234);
  });
});

describe("parseLocalizedNumber (Bangla digits)", () => {
  it("converts Bengali digits to Latin before parsing", () => {
    expect(parseLocalizedNumber("১২.৫")).toBe(12.5);
    expect(parseLocalizedNumber("০")).toBe(0);
    expect(parseLocalizedNumber("১২৩৪")).toBe(1234);
  });

  it("treats comma as decimal separator", () => {
    expect(parseLocalizedNumber("1,5")).toBe(1.5);
    expect(parseLocalizedNumber("12,75")).toBe(12.75);
  });

  it("returns 0 for blank or junk", () => {
    expect(parseLocalizedNumber("")).toBe(0);
    expect(parseLocalizedNumber("   ")).toBe(0);
    expect(parseLocalizedNumber("abc")).toBe(0);
  });

  it("clamps negative inputs to 0", () => {
    expect(parseLocalizedNumber("-5")).toBe(0);
    expect(parseLocalizedNumber("১-২")).toBe(0);
  });
});

describe("formatLocalizedNumber", () => {
  it("formats English in Latin digits", () => {
    expect(formatLocalizedNumber(1234.5, "en")).toBe("1,234.5");
  });

  it("formats Bangla in Bengali digits", () => {
    // bn-BD locale uses Bengali digits ০-৯
    const out = formatLocalizedNumber(1234.5, "bn");
    expect(out).toMatch(/^[০-৯,.]+$/);
    expect(out.replace(/[,.০-৯]/g, "")).toBe("");
    // The underlying number should still be 1234.5 once the digits are
    // mapped back.
    const digits = "০১২৩৪৫৬৭৮৯";
    const latinised = out
      .split("")
      .map((c) => {
        const idx = digits.indexOf(c);
        return idx >= 0 ? String(idx) : c;
      })
      .join("");
    expect(latinised).toBe("1,234.5");
  });

  it("never returns NaN for non-finite input", () => {
    expect(formatLocalizedNumber(NaN, "en")).toBe("0");
    expect(formatLocalizedNumber(Infinity, "en")).toBe("0");
  });
});

describe("roundUpTo", () => {
  it("rounds up to nearest 50", () => {
    expect(roundUpTo(1, 50)).toBe(50);
    expect(roundUpTo(49, 50)).toBe(50);
    expect(roundUpTo(50, 50)).toBe(50);
    expect(roundUpTo(51, 50)).toBe(100);
    expect(roundUpTo(1249, 50)).toBe(1250);
  });

  it("returns 0 for non-positive or non-finite input", () => {
    expect(roundUpTo(0, 50)).toBe(0);
    expect(roundUpTo(-1, 50)).toBe(0);
    expect(roundUpTo(NaN, 50)).toBe(0);
  });

  it("falls back to ceil when step is invalid", () => {
    expect(roundUpTo(1.4, 0)).toBe(2);
    expect(roundUpTo(1.4, -1)).toBe(2);
  });
});

describe("cap", () => {
  it("clamps to max", () => {
    expect(cap(50, 100)).toBe(50);
    expect(cap(150, 100)).toBe(100);
  });
  it("coerces negative to 0", () => {
    expect(cap(-5, 100)).toBe(0);
  });
  it("coerces non-finite to 0", () => {
    expect(cap(NaN, 100)).toBe(0);
    expect(cap(Infinity, 100)).toBe(100); // Infinity > max → max
  });
});

describe("computeBricks", () => {
  it("computes a typical 5-inch wall", () => {
    // 10 ft × 10 ft = 100 sqft, no openings, 5% wastage.
    // 100 × 4.4 = 440 raw; × 1.05 = 462; round up to 50 = 500.
    const r = computeBricks({
      lengthFt: 10,
      heightFt: 10,
      thickness: "5",
      openingsSqft: 0,
      wastagePct: 5,
    });
    expect(r.netAreaSqft).toBe(100);
    expect(r.rawBricks).toBeCloseTo(440);
    expect(r.roundedBricks).toBe(500);
    expect(r.thousands).toBe(0.5);
    expect(r.bricksPerSqft).toBe(BRICKS_PER_SQFT_5INCH);
  });

  it("computes a 10-inch wall with roughly double the bricks", () => {
    const five = computeBricks({
      lengthFt: 20,
      heightFt: 10,
      thickness: "5",
      openingsSqft: 0,
      wastagePct: 0,
    });
    const ten = computeBricks({
      lengthFt: 20,
      heightFt: 10,
      thickness: "10",
      openingsSqft: 0,
      wastagePct: 0,
    });
    // 10-inch must be ~2× the 5-inch count, not exactly (8.9 vs 4.4
    // ratio is 2.0227).
    expect(ten.rawBricks / five.rawBricks).toBeCloseTo(
      BRICKS_PER_SQFT_10INCH / BRICKS_PER_SQFT_5INCH,
      4,
    );
  });

  it("subtracts openings from the area", () => {
    const withOpenings = computeBricks({
      lengthFt: 10,
      heightFt: 10,
      thickness: "5",
      openingsSqft: 20,
      wastagePct: 0,
    });
    expect(withOpenings.netAreaSqft).toBe(80);
  });

  it("clamps negative openings to 0 (no negative area)", () => {
    const r = computeBricks({
      lengthFt: 10,
      heightFt: 10,
      thickness: "5",
      openingsSqft: -100,
      wastagePct: 5,
    });
    expect(r.netAreaSqft).toBe(100);
  });

  it("clamps wastage to [0, 50]", () => {
    const r = computeBricks({
      lengthFt: 10,
      heightFt: 10,
      thickness: "5",
      openingsSqft: 0,
      wastagePct: 9999,
    });
    // 50% wastage on 100 sqft × 4.4 = 440 raw → 660 → 700 rounded.
    expect(r.roundedBricks).toBe(700);
  });

  it("rounds to the nearest 50", () => {
    const r = computeBricks({
      lengthFt: 25,
      heightFt: 1,
      thickness: "5",
      openingsSqft: 0,
      wastagePct: 0,
    });
    // 25 sqft × 4.4 = 110 → rounds up to 150.
    expect(r.roundedBricks).toBe(150);
  });

  it("returns zeros for zero-area inputs", () => {
    const r = computeBricks({
      lengthFt: 0,
      heightFt: 0,
      thickness: "5",
      openingsSqft: 0,
      wastagePct: 5,
    });
    expect(r.netAreaSqft).toBe(0);
    expect(r.roundedBricks).toBe(0);
    expect(r.thousands).toBe(0);
  });

  it("caps absurdly large inputs without overflowing", () => {
    const r = computeBricks({
      lengthFt: 1e9,
      heightFt: 1e9,
      thickness: "5",
      openingsSqft: 0,
      wastagePct: 5,
    });
    expect(Number.isFinite(r.roundedBricks)).toBe(true);
    expect(r.roundedBricks).toBeGreaterThan(0);
  });

  it("uses BRICK_ROUND_TO step of 50", () => {
    expect(BRICK_ROUND_TO).toBe(50);
  });
});

describe("computeConcrete", () => {
  it("computes a 10×10×0.5 ft slab in 1:2:4", () => {
    // Volume = 50 CFT wet; dry = 50 × 1.54 = 77 CFT.
    // Total parts = 7.
    // Cement volume = 77 × 1/7 ≈ 11.0 CFT → 8.8 bags.
    // Sand = 77 × 2/7 ≈ 22.0 CFT.
    // Aggregate = 77 × 4/7 ≈ 44.0 CFT.
    const r = computeConcrete({
      lengthFt: 10,
      widthFt: 10,
      thickness: { ft: 0, in: 6 },
      mix: "1:2:4",
    });
    expect(r.volumeCft).toBeCloseTo(50, 5);
    expect(r.dryVolumeCft).toBeCloseTo(50 * DRY_VOLUME_FACTOR, 5);
    expect(r.totalParts).toBe(7);
    expect(r.sandCft).toBeCloseTo(22, 1);
    expect(r.aggregateCft).toBeCloseTo(44, 1);
    expect(r.cementBags).toBeGreaterThan(8);
    expect(r.cementBags).toBeLessThan(10);
  });

  it("respects the ft + inches thickness pair", () => {
    const a = computeConcrete({
      lengthFt: 10,
      widthFt: 10,
      thickness: { ft: 1, in: 0 },
      mix: "1:2:4",
    });
    const b = computeConcrete({
      lengthFt: 10,
      widthFt: 10,
      thickness: { ft: 0, in: 12 },
      mix: "1:2:4",
    });
    expect(a.volumeCft).toBeCloseTo(b.volumeCft, 5);
  });

  it("computes 1:1.5:3 (richer mix → more cement, less sand/agg)", () => {
    const r = computeConcrete({
      lengthFt: 10,
      widthFt: 10,
      thickness: { ft: 0, in: 6 },
      mix: "1:1.5:3",
    });
    expect(r.totalParts).toBeCloseTo(5.5, 5);
    // 1:1.5:3 has fewer total parts, so each unit is more cement.
    // Cement bags must be higher per CFT than 1:2:4.
    const m124 = computeConcrete({
      lengthFt: 10,
      widthFt: 10,
      thickness: { ft: 0, in: 6 },
      mix: "1:2:4",
    });
    expect(r.cementBags / r.volumeCft).toBeGreaterThan(
      m124.cementBags / m124.volumeCft,
    );
  });

  it("computes 1:3:6 (leaner mix → less cement)", () => {
    const r = computeConcrete({
      lengthFt: 10,
      widthFt: 10,
      thickness: { ft: 0, in: 6 },
      mix: "1:3:6",
    });
    const m124 = computeConcrete({
      lengthFt: 10,
      widthFt: 10,
      thickness: { ft: 0, in: 6 },
      mix: "1:2:4",
    });
    expect(r.cementBags).toBeLessThan(m124.cementBags);
  });

  it("accepts a custom ratio", () => {
    const r = computeConcrete({
      lengthFt: 1,
      widthFt: 1,
      thickness: { ft: 1, in: 0 },
      mix: "custom",
      custom: { cement: 1, sand: 1, aggregate: 3 },
    });
    expect(r.ratioUsed).toEqual({ cement: 1, sand: 1, aggregate: 3 });
    expect(r.totalParts).toBe(5);
  });

  it("falls back to 1:2:4 for an invalid custom ratio", () => {
    const r = computeConcrete({
      lengthFt: 10,
      widthFt: 10,
      thickness: { ft: 0, in: 6 },
      mix: "custom",
      custom: { cement: 0, sand: 1, aggregate: 2 },
    });
    expect(r.ratioUsed).toEqual({ cement: 1, sand: 2, aggregate: 4 });
  });

  it("returns zeros for zero-volume inputs", () => {
    const r = computeConcrete({
      lengthFt: 0,
      widthFt: 0,
      thickness: { ft: 0, in: 0 },
      mix: "1:2:4",
    });
    expect(r.volumeCft).toBe(0);
    expect(r.cementBags).toBe(0);
  });

  it("uses 1.25 CFT per cement bag (textbook constant)", () => {
    expect(CEMENT_BAG_CFT).toBe(1.25);
  });
});

describe("computeCft", () => {
  it("multiplies L × W × H in feet", () => {
    const r = computeCft({ lengthFt: 10, widthFt: 5, heightFt: 4 });
    expect(r.volumeCft).toBe(200);
  });

  it("adds inches as fractional feet", () => {
    const r = computeCft({
      lengthFt: 10,
      widthFt: 5,
      heightFt: 0,
      heightIn: 6,
    });
    expect(r.volumeCft).toBeCloseTo(25, 5);
  });

  it("clamps negative inputs to 0", () => {
    const r = computeCft({ lengthFt: -1, widthFt: 5, heightFt: 4 });
    expect(r.volumeCft).toBe(0);
  });

  it("caps absurdly large inputs without overflowing", () => {
    const r = computeCft({ lengthFt: 1e9, widthFt: 1e9, heightFt: 1e9 });
    expect(Number.isFinite(r.volumeCft)).toBe(true);
  });

  it("returns 0 when any dimension is missing/zero", () => {
    expect(computeCft({ lengthFt: 0, widthFt: 5, heightFt: 4 }).volumeCft).toBe(0);
    expect(computeCft({ lengthFt: 10, widthFt: 0, heightFt: 4 }).volumeCft).toBe(0);
    expect(computeCft({ lengthFt: 10, widthFt: 5, heightFt: 0 }).volumeCft).toBe(0);
  });
});

describe("validatePositive", () => {
  it("flags required for empty/zero", () => {
    expect(validatePositive("", 100)).toBe("required");
    expect(validatePositive(null, 100)).toBe("required");
    expect(validatePositive(0, 100)).toBe("required");
  });

  it("flags nan for non-finite", () => {
    expect(validatePositive(NaN, 100)).toBe("nan");
    expect(validatePositive("abc", 100)).toBe("nan");
  });

  it("flags tooBig when above cap", () => {
    expect(validatePositive(150, 100)).toBe("tooBig");
  });

  it("returns null for an acceptable value", () => {
    expect(validatePositive(1, 100)).toBeNull();
    expect(validatePositive(100, 100)).toBeNull();
  });
});
