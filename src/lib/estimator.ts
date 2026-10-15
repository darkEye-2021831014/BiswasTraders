/**
 * Pure, dependency-free math for the in-browser quantity estimator.
 *
 * All inputs come from the form (user-typed strings), so every helper
 * defends against the things humans actually type: empty, zero,
 * negative, NaN, Infinity, fractions, and absurdly large numbers.
 *
 * Constants and assumptions are intentionally documented in the source
 * so they can be re-derived from a textbook. They are NOT precision
 * engineering — the UI says so everywhere it shows a result.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Standard Bangladeshi brick dimensions in inches.
 * (BD standard nominal 9.5" × 4.5" × 2.75")
 */
export const BRICK_LENGTH_IN = 9.5;
export const BRICK_WIDTH_IN = 4.5;
export const BRICK_HEIGHT_IN = 2.75;

/**
 * Average mortar joint thickness (inches) used for face-shell + bed
 * mortar. 0.5" is a common on-site value.
 */
export const MORTAR_JOINT_IN = 0.5;

/**
 * With the joint, the face area of one brick (length × height) grows
 * to (9.5 + 0.5) × (2.75 + 0.5) = 10 × 3.25 = 32.5 sq in, so one brick
 * covers 32.5 / 144 = ~0.2257 sq ft.
 *
 * For a 5" wall we lay bricks stretchers (length along the wall), so
 * the bricks-per-sqft is 1 / 0.2257 ≈ 4.43. Rounded to 4.4.
 *
 * For a 10" wall we lay two stretchers side-by-side in the same
 * course, doubling the count to ~8.86. Rounded to 8.9.
 */
export const BRICKS_PER_SQFT_5INCH = 4.4;
export const BRICKS_PER_SQFT_10INCH = 8.9;

/**
 * Default wastage allowance for bricks. 5% covers broken pieces,
 * cutting, and the odd short count.
 */
export const DEFAULT_BRICK_WASTAGE_PCT = 5;

/**
 * Concrete dry-volume factor. The wet volume of mixed concrete is
 * smaller than the sum of the dry ingredients' volumes (cement fills
 * the voids between sand and aggregate). 1.54 is the textbook value
 * commonly used for nominal mix design.
 */
export const DRY_VOLUME_FACTOR = 1.54;

/**
 * One 50 kg cement bag has a volume of about 1.25 CFT (≈ 35 L).
 * (50 kg × 1/1440 kg/L density of cement ≈ 34.7 L ≈ 1.225 CFT.)
 */
export const CEMENT_BAG_CFT = 1.25;

/**
 * Max input bounds. Anything outside these is treated as a "huge"
 * or "bad" value and produces a graceful result rather than a number
 * that overflows the UI.
 */
export const MAX_LENGTH_FT = 10_000;       // 10,000 ft is a huge site
export const MAX_AREA_SQFT = 1_000_000;    // 1 million sqft
export const MAX_VOLUME_CFT = 1_000_000;   // 1 million cft
export const MAX_WASTAGE_PCT = 50;         // >50% is a typo
export const MIN_WASTAGE_PCT = 0;
export const MAX_OPENING_SQFT = 10_000;

/**
 * Round a brick count up to the nearest 50. The site's selling unit
 * is "per 1,000 pcs" but bricks are counted in tens at the truck —
 * rounding to 50 keeps the figure honest without claiming precision.
 */
export const BRICK_ROUND_TO = 50;

// ---------------------------------------------------------------------------
// Small numeric helpers
// ---------------------------------------------------------------------------

/**
 * Coerce a form input to a finite, non-negative number. Returns 0 for
 * anything we can't read as a real, non-negative value:
 *   - empty string
 *   - null / undefined
 *   - NaN
 *   - ±Infinity
 *   - negative
 * Caller is responsible for the "is this zero?" check if zero is
 * invalid for the field.
 */
export function toFiniteNumber(raw: unknown): number {
  if (raw === null || raw === undefined) return 0;
  const n = typeof raw === "string" ? parseFloat(raw) : Number(raw);
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  return n;
}

/**
 * Bangla-digit-aware parse. The site accepts Bengali digits (০-৯) in
 * numeric inputs, so we normalise them before parseFloat. We also
 * treat comma as the decimal separator (Bangladesh convention).
 *
 * Only a leading minus sign + digits + a single decimal separator
 * is accepted. Junk in the middle (e.g. "1-2", "1.2.3") is treated
 * as 0 — we don't try to be clever, we just refuse to give a
 * misleading number.
 */
export function parseLocalizedNumber(raw: string): number {
  if (raw === null || raw === undefined) return 0;
  // Normalise Bangla digits to Latin, and comma to dot.
  const normalised = String(raw)
    .replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - "০".charCodeAt(0)))
    .replace(/,/g, ".")
    .trim();
  if (normalised === "" || normalised === "-" || normalised === ".") return 0;
  // Only accept a clean number: optional leading minus, digits, optional
  // single dot, more digits. Anything else (e.g. "1-2", "1.2.3",
  // "1e") is treated as junk.
  if (!/^-?\d*\.?\d+$/.test(normalised)) return 0;
  const n = parseFloat(normalised);
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n;
}

/**
 * Format a number in the Bangla digit script (bn-BD).
 * The site is Bangla-only, so the `locale` argument is accepted for
 * API stability but always treated as "bn".
 */
export function formatLocalizedNumber(
  value: number,
  _locale: "bn" = "bn",
  maximumFractionDigits = 2,
): string {
  if (!Number.isFinite(value)) return "0";
  const intl = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
  });
  return intl.format(value);
}

/**
 * Round up to the nearest multiple (e.g. 50, 100, 1000). The default
 * value of 50 is used for brick counts. Returns 0 for non-positive
 * inputs and the input itself when the input is smaller than the
 * step (e.g. asking to round 30 up to 50 returns 50).
 */
export function roundUpTo(value: number, step: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (!Number.isFinite(step) || step <= 0) return Math.ceil(value);
  return Math.ceil(value / step) * step;
}

/**
 * Cap a value to a sensible maximum so a typo (e.g. a 7-digit number
 * in a "wall length" field) doesn't break the result display.
 *   - NaN → 0 (no usable value).
 *   - ±Infinity → max (Infinity is "huge", so the cap kicks in).
 *   - Negative → 0.
 */
export function cap(value: number, max: number): number {
  if (Number.isNaN(value)) return 0;
  if (!Number.isFinite(value)) return max;
  if (value < 0) return 0;
  return Math.min(value, max);
}

// ---------------------------------------------------------------------------
// 1. Bricks
// ---------------------------------------------------------------------------

export type BrickInputs = {
  /** Wall length in feet. */
  lengthFt: number;
  /** Wall height in feet. */
  heightFt: number;
  /** "5" for a 5-inch single-brick wall, "10" for a 10-inch double-brick wall. */
  thickness: "5" | "10";
  /** Openings (doors, windows) to subtract from the wall area, in sq ft. */
  openingsSqft: number;
  /** Wastage allowance in percent (0..50). */
  wastagePct: number;
};

export type BrickResult = {
  /** Net wall area after subtracting openings (sq ft). */
  netAreaSqft: number;
  /** Raw brick count before wastage. */
  rawBricks: number;
  /** Brick count after wastage, rounded up to the nearest 50. */
  roundedBricks: number;
  /** Approximate thousands (e.g. 1.2 = 1,200 bricks). */
  thousands: number;
  /** Bricks per sq ft used in the calc (4.4 or 8.9). */
  bricksPerSqft: number;
};

/**
 * Compute brick count for a rectangular wall. Caller is expected to
 * have validated the inputs (positive, not absurdly large). The
 * function itself is defensive: bad inputs return a zero result.
 */
export function computeBricks(input: BrickInputs): BrickResult {
  const length = cap(input.lengthFt, MAX_LENGTH_FT);
  const height = cap(input.heightFt, MAX_LENGTH_FT);
  const openings = cap(input.openingsSqft, MAX_OPENING_SQFT);
  const wastage = Math.min(
    Math.max(input.wastagePct || 0, MIN_WASTAGE_PCT),
    MAX_WASTAGE_PCT,
  );

  const grossArea = length * height;
  const netAreaSqft = Math.max(0, grossArea - openings);

  const bricksPerSqft =
    input.thickness === "10" ? BRICKS_PER_SQFT_10INCH : BRICKS_PER_SQFT_5INCH;

  const rawBricks = netAreaSqft * bricksPerSqft;
  const withWastage = rawBricks * (1 + wastage / 100);
  const roundedBricks = roundUpTo(withWastage, BRICK_ROUND_TO);

  return {
    netAreaSqft,
    rawBricks,
    roundedBricks,
    thousands: roundedBricks / 1000,
    bricksPerSqft,
  };
}

// ---------------------------------------------------------------------------
// 2. Concrete
// ---------------------------------------------------------------------------

/** Standard nominal mix ratios. The three numbers are cement:sand:aggregate. */
export type MixRatio = "1:2:4" | "1:1.5:3" | "1:3:6" | "custom";

export type CustomRatio = {
  cement: number;
  sand: number;
  aggregate: number;
};

export type ConcreteInputs = {
  /** Length of the pour in feet. */
  lengthFt: number;
  /** Width of the pour in feet. */
  widthFt: number;
  /** Thickness of the pour. */
  thickness: {
    /** Whole feet. 0 if thickness is purely inches. */
    ft: number;
    /** Inches (0..11). 0 if thickness is purely feet. */
    in: number;
  };
  mix: MixRatio;
  custom?: CustomRatio;
};

export type ConcreteResult = {
  /** Wet volume in cubic feet. */
  volumeCft: number;
  /** Dry volume = wet volume × 1.54. */
  dryVolumeCft: number;
  /** Sum of mix ratio parts (e.g. 1+2+4 = 7). */
  totalParts: number;
  /** Cement bags (50 kg each, 1.25 CFT per bag). */
  cementBags: number;
  /** Sand in CFT. */
  sandCft: number;
  /** Stone chips / khoa in CFT. */
  aggregateCft: number;
  /** The ratio actually used (helpful for the UI when custom is selected). */
  ratioUsed: CustomRatio;
};

const PRESETS: Record<Exclude<MixRatio, "custom">, CustomRatio> = {
  "1:2:4": { cement: 1, sand: 2, aggregate: 4 },
  "1:1.5:3": { cement: 1, sand: 1.5, aggregate: 3 },
  "1:3:6": { cement: 1, sand: 3, aggregate: 6 },
};

/**
 * Compute concrete ingredients for a rectangular pour. The thickness
 * field accepts a ft + inches pair (typical for slabs/beams/columns).
 */
export function computeConcrete(input: ConcreteInputs): ConcreteResult {
  const length = cap(input.lengthFt, MAX_LENGTH_FT);
  const width = cap(input.widthFt, MAX_LENGTH_FT);
  const thickFt = cap(input.thickness.ft, MAX_LENGTH_FT);
  const thickIn = Math.min(Math.max(input.thickness.in || 0, 0), 12);
  // Roll 12 inches up to 1 ft so {ft:0, in:12} matches {ft:1, in:0}.
  const totalFt = thickFt + (thickIn % 12) / 12 + Math.floor(thickIn / 12);
  const volumeCft = cap(length * width * totalFt, MAX_VOLUME_CFT);

  const ratio =
    input.mix === "custom"
      ? sanitiseRatio(input.custom)
      : PRESETS[input.mix];

  const dryVolumeCft = volumeCft * DRY_VOLUME_FACTOR;
  const totalParts = ratio.cement + ratio.sand + ratio.aggregate;
  const cementVolumeCft = (dryVolumeCft * ratio.cement) / totalParts;
  const sandCft = (dryVolumeCft * ratio.sand) / totalParts;
  const aggregateCft = (dryVolumeCft * ratio.aggregate) / totalParts;
  const cementBags = cementVolumeCft / CEMENT_BAG_CFT;

  return {
    volumeCft,
    dryVolumeCft,
    totalParts,
    cementBags,
    sandCft,
    aggregateCft,
    ratioUsed: ratio,
  };
}

function sanitiseRatio(custom: CustomRatio | undefined): CustomRatio {
  // Guard against 0 or NaN parts. Fall back to 1:2:4 (the most common
  // nominal mix in residential RCC in Bangladesh).
  if (!custom) return PRESETS["1:2:4"];
  const c = toFiniteNumber(custom.cement);
  const s = toFiniteNumber(custom.sand);
  const a = toFiniteNumber(custom.aggregate);
  if (c <= 0 || s <= 0 || a <= 0) return PRESETS["1:2:4"];
  return { cement: c, sand: s, aggregate: a };
}

// ---------------------------------------------------------------------------
// 3. CFT
// ---------------------------------------------------------------------------

export type CftInputs = {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  /** Optional inch part for each dimension (0..11.999). */
  lengthIn?: number;
  widthIn?: number;
  heightIn?: number;
};

export type CftResult = {
  volumeCft: number;
  totalFt: { length: number; width: number; height: number };
};

/**
 * Compute CFT for a rectangular volume. Each dimension is the sum
 * of its feet and inch parts.
 */
export function computeCft(input: CftInputs): CftResult {
  // Roll any 12-inch chunk up to 1 ft so L=10ft+12in matches L=11ft.
  const totalFor = (ft: number, inc: number | undefined) => {
    const f = cap(ft, MAX_LENGTH_FT);
    const i = Math.min(Math.max(inc ?? 0, 0), 12);
    return f + (i % 12) / 12 + Math.floor(i / 12);
  };
  const length = totalFor(input.lengthFt, input.lengthIn);
  const width = totalFor(input.widthFt, input.widthIn);
  const height = totalFor(input.heightFt, input.heightIn);
  const volumeCft = cap(length * width * height, MAX_VOLUME_CFT);
  return {
    volumeCft,
    totalFt: { length, width, height },
  };
}

// ---------------------------------------------------------------------------
// Validation (used by the form to show inline errors)
// ---------------------------------------------------------------------------

export type ValidationError = { field: string; message: string };

/**
 * Validate a numeric input. Returns a localised-ish error message key
 * the UI can render, or null when the value is acceptable.
 *
 *   "required"   — empty/zero
 *   "negative"   — should not be possible (we coerce) but flagged
 *   "tooBig"     — exceeds the per-field cap
 *   "nan"        — non-finite
 */
export function validatePositive(
  raw: unknown,
  cap_value: number,
): null | "required" | "tooBig" | "nan" {
  if (raw === null || raw === undefined) return "required";
  if (typeof raw === "string" && raw.trim() === "") return "required";
  const n = typeof raw === "string" ? parseFloat(raw) : Number(raw);
  if (!Number.isFinite(n)) return "nan";
  if (n < 0) return "required";
  if (n === 0) return "required";
  if (n > cap_value) return "tooBig";
  return null;
}
