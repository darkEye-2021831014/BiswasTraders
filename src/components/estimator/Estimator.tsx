"use client";

import { useId, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import {
  computeBricks,
  computeCft,
  computeConcrete,
  formatLocalizedNumber,
  MAX_LENGTH_FT,
  MAX_OPENING_SQFT,
  parseLocalizedNumber,
  validatePositive,
  type MixRatio,
} from "@/lib/estimator";
import { waHref, telHref } from "@/lib/contact";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";

/**
 * Three-tab quantity estimator (Bricks / Concrete / CFT).
 *
 * All math runs in src/lib/estimator.ts — this component is just
 * forms, validation, and presentation. The result never shows a price;
 * it only ends with "Ask for the price of this quantity" buttons that
 * open a prefilled WhatsApp conversation or trigger a phone call.
 *
 * Inputs accept Bangla digits (০-৯) and use comma as decimal separator
 * (Bangladesh convention). Output is rendered in the active locale's
 * digit script.
 */

type Tab = "bricks" | "concrete" | "cft";

type Labels = {
  tabBricks: string;
  tabConcrete: string;
  tabCft: string;
  // Bricks
  lengthFt: string;
  heightFt: string;
  thickness: string;
  thickness5: string;
  thickness10: string;
  openingsSqft: string;
  openingsOptional: string;
  wastagePct: string;
  wastageDefault: string;
  resultBricksTitle: string;
  resultBricksPieces: string;
  resultBricksThousands: string;
  resultBricksPerSqft: string;
  resultBricksArea: string;
  resultBricksWastage: string;
  // Concrete
  concreteLength: string;
  concreteWidth: string;
  concreteThickness: string;
  concreteMix: string;
  concreteMixCustom: string;
  concreteMixCement: string;
  concreteMixSand: string;
  concreteMixAggregate: string;
  resultConcreteTitle: string;
  resultConcreteVolume: string;
  resultConcreteDry: string;
  resultConcreteCement: string;
  resultConcreteSand: string;
  resultConcreteAggregate: string;
  resultConcreteRatio: string;
  // CFT
  cftLength: string;
  cftWidth: string;
  cftHeight: string;
  cftInches: string;
  cftFeet: string;
  resultCftTitle: string;
  resultCftTotal: string;
  // Validation + actions
  validateRequired: string;
  validateTooBig: string;
  validateNan: string;
  estimateNote: string;
  calc: string;
  askForPrice: string;
  askForPriceQuantity: string;
  callNow: string;
  whatsapp: string;
  // Mix ratio labels
  mix1_2_4: string;
  mix1_1_5_3: string;
  mix1_3_6: string;
  // Numbers / units
  numberCft: string;
  numberBags: string;
  numberPieces: string;
  numberSqft: string;
  unitCft: string;
  unitBag: string;
  unitPcs: string;
  unitSqft: string;
};

const MIX_PRESET_LABEL_KEYS: Record<Exclude<MixRatio, "custom">, keyof Labels> = {
  "1:2:4": "mix1_2_4",
  "1:1.5:3": "mix1_1_5_3",
  "1:3:6": "mix1_3_6",
};

export function Estimator({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Labels;
}) {
  const [tab, setTab] = useState<Tab>("bricks");
  return (
    <div>
      <Tabs tab={tab} onChange={setTab} labels={labels} />
      <div className="mt-5">
        {tab === "bricks" ? <BricksTab locale={locale} labels={labels} /> : null}
        {tab === "concrete" ? (
          <ConcreteTab locale={locale} labels={labels} />
        ) : null}
        {tab === "cft" ? <CftTab locale={locale} labels={labels} /> : null}
      </div>
    </div>
  );
}

function Tabs({
  tab,
  onChange,
  labels,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  labels: Labels;
}) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "bricks", label: labels.tabBricks },
    { id: "concrete", label: labels.tabConcrete },
    { id: "cft", label: labels.tabCft },
  ];
  return (
    <div
      role="tablist"
      aria-label="Estimator"
      className="grid grid-cols-3 border-b-2 border-charcoal"
    >
      {tabs.map((t) => {
        const selected = t.id === tab;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={[
              "h-12 px-3 font-display font-semibold uppercase tracking-label text-sm",
              "border-r-2 border-charcoal last:border-r-0",
              selected
                ? "bg-charcoal text-canvas"
                : "bg-canvas text-charcoal hover:bg-sand",
            ].join(" ")}
            style={{ borderRadius: 0 }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Numeric input — accepts Bangla digits, displays in current locale.
// ---------------------------------------------------------------------------

function NumberInput({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  required,
  inputMode = "decimal",
  locale,
  labels,
  max,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  required?: boolean;
  inputMode?: "decimal" | "numeric";
  locale: Locale;
  labels: Labels;
  max?: number;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between text-[11px] uppercase tracking-eyebrow font-display text-charcoal/70"
      >
        <span>{label}</span>
        {hint ? (
          <span className="text-[10px] text-charcoal/70 normal-case tracking-normal font-sans">
            {hint}
          </span>
        ) : null}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        spellCheck={false}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-1 block w-full bg-canvas border-[1.5px] h-12 px-3 tabular focus:outline-none",
          error ? "border-brick" : "border-mortar focus:border-brick",
        ].join(" ")}
        style={{ borderRadius: 2 }}
      />
      {!error && hint ? (
        <span
          id={`${id}-hint`}
          className="block text-xs text-charcoal/70 mt-1"
        >
          {hint}
        </span>
      ) : null}
      {error ? (
        <span
          id={`${id}-err`}
          className="block text-xs text-brick mt-1"
          role="alert"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}

function validateRaw(
  raw: string,
  cap: number,
  labels: Labels,
  locale: Locale,
  allowZero = false,
): string | null {
  const err = validatePositive(
    parseLocalizedNumber(raw),
    cap,
  );
  if (err === null) {
    if (!allowZero && parseLocalizedNumber(raw) === 0) {
      return labels.validateRequired;
    }
    return null;
  }
  if (err === "required") return labels.validateRequired;
  if (err === "tooBig") return labels.validateTooBig;
  if (err === "nan") return labels.validateNan;
  // Fallback — should never reach here.
  return locale === "bn" ? "ত্রুটি" : "Error";
}

// ---------------------------------------------------------------------------
// Bricks tab
// ---------------------------------------------------------------------------

function BricksTab({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Labels;
}) {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [thickness, setThickness] = useState<"5" | "10">("5");
  const [openings, setOpenings] = useState("");
  const [wastage, setWastage] = useState("5");
  const [showResult, setShowResult] = useState(false);

  const lengthErr = length && showResult
    ? validateRaw(length, MAX_LENGTH_FT, labels, locale)
    : null;
  const heightErr = height && showResult
    ? validateRaw(height, MAX_LENGTH_FT, labels, locale)
    : null;
  const wastageNum = parseLocalizedNumber(wastage);
  const wastageErr =
    showResult && (Number.isNaN(wastageNum) || wastageNum < 0 || wastageNum > 50)
      ? labels.validateTooBig
      : null;
  const openingsErr =
    showResult && openings && Number.isNaN(parseLocalizedNumber(openings))
      ? labels.validateNan
      : null;

  const canCompute =
    parseLocalizedNumber(length) > 0 && parseLocalizedNumber(height) > 0;

  const result = useMemo(() => {
    if (!canCompute) return null;
    return computeBricks({
      lengthFt: parseLocalizedNumber(length),
      heightFt: parseLocalizedNumber(height),
      thickness,
      openingsSqft: parseLocalizedNumber(openings),
      wastagePct: parseLocalizedNumber(wastage),
    });
  }, [canCompute, length, height, thickness, openings, wastage]);

  const lengthId = useId();
  const heightId = useId();
  const openingId = useId();
  const wastageId = useId();

  function handleCalc() {
    setShowResult(true);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput
          id={lengthId}
          label={labels.lengthFt}
          value={length}
          onChange={setLength}
          error={lengthErr}
          locale={locale}
          labels={labels}
        />
        <NumberInput
          id={heightId}
          label={labels.heightFt}
          value={height}
          onChange={setHeight}
          error={heightErr}
          locale={locale}
          labels={labels}
        />
      </div>

      <fieldset>
        <legend className="block text-[11px] uppercase tracking-eyebrow font-display text-charcoal/70">
          {labels.thickness}
        </legend>
        <div className="mt-1 grid grid-cols-2 border-[1.5px] border-mortar" style={{ borderRadius: 2 }}>
          {(["5", "10"] as const).map((v, idx) => (
            <label
              key={v}
              className={[
                "flex items-center justify-center h-12 cursor-pointer text-sm font-display",
                idx === 0 ? "border-r-[1.5px] border-mortar" : "",
                thickness === v ? "bg-charcoal text-canvas" : "bg-canvas text-charcoal hover:bg-sand",
              ].join(" ")}
              style={{ borderRadius: 0 }}
            >
              <input
                type="radio"
                name="brick-thickness"
                value={v}
                checked={thickness === v}
                onChange={() => setThickness(v)}
                className="sr-only"
              />
              {v === "5" ? labels.thickness5 : labels.thickness10}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput
          id={openingId}
          label={labels.openingsSqft}
          hint={labels.openingsOptional}
          value={openings}
          onChange={setOpenings}
          error={openingsErr}
          locale={locale}
          labels={labels}
          max={MAX_OPENING_SQFT}
        />
        <NumberInput
          id={wastageId}
          label={labels.wastagePct}
          hint={labels.wastageDefault}
          value={wastage}
          onChange={setWastage}
          error={wastageErr}
          locale={locale}
          labels={labels}
          max={50}
        />
      </div>

      <button
        type="button"
        onClick={handleCalc}
        disabled={!canCompute}
        className="h-12 px-5 bg-brick text-white font-display font-semibold uppercase tracking-label border border-brick hover:bg-brick-hover hover:shadow-stamp-brick-sm transition-transform duration-100 active:translate-x-[1px] active:translate-y-[1px] disabled:bg-mortar disabled:border-mortar disabled:text-charcoal/70 disabled:cursor-not-allowed disabled:hover:bg-mortar disabled:hover:shadow-none"
        style={{ borderRadius: 2 }}
      >
        {labels.calc}
      </button>

      {result ? (
        <BricksResult
          locale={locale}
          labels={labels}
          result={result}
          wastagePct={parseLocalizedNumber(wastage)}
        />
      ) : null}
    </div>
  );
}

function BricksResult({
  locale,
  labels,
  result,
  wastagePct,
}: {
  locale: Locale;
  labels: Labels;
  result: ReturnType<typeof computeBricks>;
  wastagePct: number;
}) {
  const qtyStr = formatLocalizedNumber(result.roundedBricks, locale, 0);
  const thousandsStr = formatLocalizedNumber(result.thousands, locale, 2);
  const areaStr = formatLocalizedNumber(result.netAreaSqft, locale, 1);
  const wastageStr = formatLocalizedNumber(wastagePct, locale, 0);
  const perSqftStr = formatLocalizedNumber(result.bricksPerSqft, locale, 1);

  const wa = waHref({
    locale,
    product: labels.tabBricks,
    quantity: `${qtyStr} ${labels.resultBricksPieces}`,
  });

  return (
    <div
      className="border border-line bg-sand p-4 md:p-5"
      style={{ borderRadius: 2 }}
    >
      <div className="dim-rule dim-rule--start mb-3">
        <span className="whitespace-nowrap">{labels.resultBricksTitle}</span>
      </div>
      <div className="font-display text-3xl tabular leading-tight">
        {qtyStr}{" "}
        <span className="text-lg font-sans font-normal text-charcoal/80">
          {labels.resultBricksPieces}
        </span>
      </div>
      <div className="text-sm text-charcoal/70 mt-1">
        {labels.resultBricksThousands}: {thousandsStr}
      </div>
      <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultBricksArea}
          </dt>
          <dd className="tabular text-base">
            {areaStr} {labels.unitSqft}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultBricksPerSqft}
          </dt>
          <dd className="tabular text-base">
            {perSqftStr} {labels.unitPcs}/{labels.unitSqft}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultBricksWastage}
          </dt>
          <dd className="tabular text-base">{wastageStr}%</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-charcoal/70 italic">{labels.estimateNote}</p>
      <ResultActions
        labels={labels}
        whatsappHref={wa}
        quantityText={`${qtyStr} ${labels.resultBricksPieces}`}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Concrete tab
// ---------------------------------------------------------------------------

function ConcreteTab({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Labels;
}) {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickFt, setThickFt] = useState("0");
  const [thickIn, setThickIn] = useState("6");
  const [mix, setMix] = useState<MixRatio>("1:2:4");
  const [customC, setCustomC] = useState("1");
  const [customS, setCustomS] = useState("2");
  const [customA, setCustomA] = useState("4");
  const [showResult, setShowResult] = useState(false);

  const lengthNum = parseLocalizedNumber(length);
  const widthNum = parseLocalizedNumber(width);
  const thickFtNum = parseLocalizedNumber(thickFt);
  const thickInNum = parseLocalizedNumber(thickIn);
  const totalThickness = thickFtNum + thickInNum / 12;

  const lengthErr =
    showResult && length
      ? validateRaw(length, MAX_LENGTH_FT, labels, locale)
      : null;
  const widthErr =
    showResult && width
      ? validateRaw(width, MAX_LENGTH_FT, labels, locale)
      : null;

  const canCompute = lengthNum > 0 && widthNum > 0 && totalThickness > 0;

  const result = useMemo(() => {
    if (!canCompute) return null;
    return computeConcrete({
      lengthFt: lengthNum,
      widthFt: widthNum,
      thickness: { ft: thickFtNum, in: thickInNum },
      mix,
      custom:
        mix === "custom"
          ? {
              cement: parseLocalizedNumber(customC),
              sand: parseLocalizedNumber(customS),
              aggregate: parseLocalizedNumber(customA),
            }
          : undefined,
    });
  }, [
    canCompute,
    lengthNum,
    widthNum,
    thickFtNum,
    thickInNum,
    mix,
    customC,
    customS,
    customA,
  ]);

  const lengthId = useId();
  const widthId = useId();
  const thickFtId = useId();
  const thickInId = useId();
  const customCId = useId();
  const customSId = useId();
  const customAId = useId();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput
          id={lengthId}
          label={labels.concreteLength}
          value={length}
          onChange={setLength}
          error={lengthErr}
          locale={locale}
          labels={labels}
        />
        <NumberInput
          id={widthId}
          label={labels.concreteWidth}
          value={width}
          onChange={setWidth}
          error={widthErr}
          locale={locale}
          labels={labels}
        />
      </div>

      <fieldset>
        <legend className="block text-[11px] uppercase tracking-eyebrow font-display text-charcoal/70">
          {labels.concreteThickness}
        </legend>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <NumberInput
            id={thickFtId}
            label={labels.cftFeet}
            value={thickFt}
            onChange={setThickFt}
            locale={locale}
            labels={labels}
            max={MAX_LENGTH_FT}
          />
          <NumberInput
            id={thickInId}
            label={labels.cftInches}
            value={thickIn}
            onChange={setThickIn}
            locale={locale}
            labels={labels}
            max={12}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="block text-[11px] uppercase tracking-eyebrow font-display text-charcoal/70">
          {labels.concreteMix}
        </legend>
        <div className="mt-1 grid grid-cols-2 md:grid-cols-4 border-[1.5px] border-mortar" style={{ borderRadius: 2 }}>
          {(["1:2:4", "1:1.5:3", "1:3:6", "custom"] as MixRatio[]).map((m, idx, arr) => {
            const isSelected = m === mix;
            const label =
              m === "custom"
                ? labels.concreteMixCustom
                : labels[MIX_PRESET_LABEL_KEYS[m as Exclude<MixRatio, "custom">]];
            return (
              <label
                key={m}
                className={[
                  "flex items-center justify-center h-12 cursor-pointer text-sm font-display",
                  idx < arr.length - 1 ? "border-r-[1.5px] border-mortar" : "",
                  isSelected ? "bg-charcoal text-canvas" : "bg-canvas text-charcoal hover:bg-sand",
                ].join(" ")}
                style={{ borderRadius: 0 }}
              >
                <input
                  type="radio"
                  name="concrete-mix"
                  value={m}
                  checked={isSelected}
                  onChange={() => setMix(m)}
                  className="sr-only"
                />
                {label}
              </label>
            );
          })}
        </div>
        {mix === "custom" ? (
          <div className="mt-3 grid grid-cols-3 gap-3">
            <NumberInput
              id={customCId}
              label={labels.concreteMixCement}
              value={customC}
              onChange={setCustomC}
              locale={locale}
              labels={labels}
            />
            <NumberInput
              id={customSId}
              label={labels.concreteMixSand}
              value={customS}
              onChange={setCustomS}
              locale={locale}
              labels={labels}
            />
            <NumberInput
              id={customAId}
              label={labels.concreteMixAggregate}
              value={customA}
              onChange={setCustomA}
              locale={locale}
              labels={labels}
            />
          </div>
        ) : null}
      </fieldset>

      <button
        type="button"
        onClick={() => setShowResult(true)}
        disabled={!canCompute}
        className="h-12 px-5 bg-brick text-white font-display font-semibold uppercase tracking-label border border-brick hover:bg-brick-hover hover:shadow-stamp-brick-sm transition-transform duration-100 active:translate-x-[1px] active:translate-y-[1px] disabled:bg-mortar disabled:border-mortar disabled:text-charcoal/70 disabled:cursor-not-allowed disabled:hover:bg-mortar disabled:hover:shadow-none"
        style={{ borderRadius: 2 }}
      >
        {labels.calc}
      </button>

      {result ? (
        <ConcreteResult
          locale={locale}
          labels={labels}
          result={result}
        />
      ) : null}
    </div>
  );
}

function ConcreteResult({
  locale,
  labels,
  result,
}: {
  locale: Locale;
  labels: Labels;
  result: ReturnType<typeof computeConcrete>;
}) {
  const volStr = formatLocalizedNumber(result.volumeCft, locale, 2);
  const dryStr = formatLocalizedNumber(result.dryVolumeCft, locale, 2);
  const cementStr = formatLocalizedNumber(result.cementBags, locale, 1);
  const sandStr = formatLocalizedNumber(result.sandCft, locale, 2);
  const aggStr = formatLocalizedNumber(result.aggregateCft, locale, 2);
  const ratioStr = `${result.ratioUsed.cement} : ${result.ratioUsed.sand} : ${result.ratioUsed.aggregate}`;

  // Build a friendly quantity line for the WhatsApp prefilled message.
  const qtyParts: string[] = [];
  if (result.cementBags > 0) {
    qtyParts.push(`${cementStr} ${labels.numberBags}`);
  }
  if (result.sandCft > 0) {
    qtyParts.push(`${sandStr} ${labels.numberCft} ${labels.resultConcreteSand}`);
  }
  if (result.aggregateCft > 0) {
    qtyParts.push(
      `${aggStr} ${labels.numberCft} ${labels.resultConcreteAggregate}`,
    );
  }
  const qtyText = qtyParts.join(" + ");

  const wa = waHref({
    locale,
    product: labels.tabConcrete,
    quantity: qtyText,
  });

  return (
    <div
      className="border border-line bg-sand p-4 md:p-5"
      style={{ borderRadius: 2 }}
    >
      <div className="dim-rule dim-rule--start mb-3">
        <span className="whitespace-nowrap">{labels.resultConcreteTitle}</span>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultConcreteVolume}
          </dt>
          <dd className="tabular text-lg font-display">
            {volStr} {labels.unitCft}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultConcreteDry}
          </dt>
          <dd className="tabular text-lg font-display">
            {dryStr} {labels.unitCft}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultConcreteCement}
          </dt>
          <dd className="tabular text-lg font-display">
            {cementStr} {labels.unitBag}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultConcreteSand}
          </dt>
          <dd className="tabular text-lg font-display">
            {sandStr} {labels.unitCft}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultConcreteAggregate}
          </dt>
          <dd className="tabular text-lg font-display">
            {aggStr} {labels.unitCft}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.resultConcreteRatio}
          </dt>
          <dd className="tabular text-lg font-display">{ratioStr}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-charcoal/70 italic">{labels.estimateNote}</p>
      <ResultActions
        labels={labels}
        whatsappHref={wa}
        quantityText={qtyText}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CFT tab
// ---------------------------------------------------------------------------

function CftTab({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Labels;
}) {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lengthIn, setLengthIn] = useState("0");
  const [widthIn, setWidthIn] = useState("0");
  const [heightIn, setHeightIn] = useState("0");
  const [showResult, setShowResult] = useState(false);

  const lengthErr =
    showResult && length
      ? validateRaw(length, MAX_LENGTH_FT, labels, locale)
      : null;
  const widthErr =
    showResult && width
      ? validateRaw(width, MAX_LENGTH_FT, labels, locale)
      : null;
  const heightErr =
    showResult && height
      ? validateRaw(height, MAX_LENGTH_FT, labels, locale)
      : null;

  const canCompute =
    parseLocalizedNumber(length) > 0 &&
    parseLocalizedNumber(width) > 0 &&
    parseLocalizedNumber(height) > 0;

  const result = useMemo(() => {
    if (!canCompute) return null;
    return computeCft({
      lengthFt: parseLocalizedNumber(length),
      widthFt: parseLocalizedNumber(width),
      heightFt: parseLocalizedNumber(height),
      lengthIn: parseLocalizedNumber(lengthIn),
      widthIn: parseLocalizedNumber(widthIn),
      heightIn: parseLocalizedNumber(heightIn),
    });
  }, [
    canCompute,
    length,
    width,
    height,
    lengthIn,
    widthIn,
    heightIn,
  ]);

  const lId = useId();
  const wId = useId();
  const hId = useId();
  const liId = useId();
  const wiId = useId();
  const hiId = useId();

  return (
    <div className="space-y-4">
      {(
        [
          { id: lId, ftLabel: labels.cftLength, inLabel: labels.cftInches, ft: length, setFt: setLength, in: lengthIn, setIn: setLengthIn, err: lengthErr },
          { id: wId, ftLabel: labels.cftWidth, inLabel: labels.cftInches, ft: width, setFt: setWidth, in: widthIn, setIn: setWidthIn, err: widthErr },
          { id: hId, ftLabel: labels.cftHeight, inLabel: labels.cftInches, ft: height, setFt: setHeight, in: heightIn, setIn: setHeightIn, err: heightErr },
        ] as const
      ).map((d) => (
        <div key={d.id} className="grid grid-cols-2 gap-3">
          <NumberInput
            id={d.id}
            label={`${d.ftLabel} (${labels.cftFeet})`}
            value={d.ft}
            onChange={d.setFt}
            error={d.err}
            locale={locale}
            labels={labels}
          />
          <NumberInput
            id={`${d.id}-in`}
            label={`${d.ftLabel} (${d.inLabel})`}
            value={d.in}
            onChange={d.setIn}
            locale={locale}
            labels={labels}
            max={12}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => setShowResult(true)}
        disabled={!canCompute}
        className="h-12 px-5 bg-brick text-white font-display font-semibold uppercase tracking-label border border-brick hover:bg-brick-hover hover:shadow-stamp-brick-sm transition-transform duration-100 active:translate-x-[1px] active:translate-y-[1px] disabled:bg-mortar disabled:border-mortar disabled:text-charcoal/70 disabled:cursor-not-allowed disabled:hover:bg-mortar disabled:hover:shadow-none"
        style={{ borderRadius: 2 }}
      >
        {labels.calc}
      </button>

      {result ? <CftResult locale={locale} labels={labels} result={result} /> : null}
    </div>
  );
}

function CftResult({
  locale,
  labels,
  result,
}: {
  locale: Locale;
  labels: Labels;
  result: ReturnType<typeof computeCft>;
}) {
  const volStr = formatLocalizedNumber(result.volumeCft, locale, 2);
  const lStr = formatLocalizedNumber(result.totalFt.length, locale, 2);
  const wStr = formatLocalizedNumber(result.totalFt.width, locale, 2);
  const hStr = formatLocalizedNumber(result.totalFt.height, locale, 2);
  const qtyText = `${volStr} ${labels.unitCft}`;
  const wa = waHref({
    locale,
    product: labels.tabCft,
    quantity: qtyText,
  });
  return (
    <div
      className="border border-line bg-sand p-4 md:p-5"
      style={{ borderRadius: 2 }}
    >
      <div className="dim-rule dim-rule--start mb-3">
        <span className="whitespace-nowrap">{labels.resultCftTitle}</span>
      </div>
      <div className="font-display text-3xl tabular leading-tight">
        {volStr}{" "}
        <span className="text-lg font-sans font-normal text-charcoal/80">
          {labels.unitCft}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.cftLength}
          </dt>
          <dd className="tabular text-base">
            {lStr} {labels.cftFeet}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.cftWidth}
          </dt>
          <dd className="tabular text-base">
            {wStr} {labels.cftFeet}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.cftHeight}
          </dt>
          <dd className="tabular text-base">
            {hStr} {labels.cftFeet}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-charcoal/70 italic">{labels.estimateNote}</p>
      <ResultActions labels={labels} whatsappHref={wa} quantityText={qtyText} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result actions — Call + WhatsApp, both with the quantity prefilled.
// ---------------------------------------------------------------------------

function ResultActions({
  labels,
  whatsappHref,
  quantityText,
}: {
  labels: Labels;
  whatsappHref: string;
  quantityText: string;
}) {
  return (
    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-4 bg-brick text-white font-display font-semibold uppercase tracking-label border border-brick hover:bg-brick-hover hover:shadow-stamp-brick-sm"
        style={{ borderRadius: 2 }}
      >
        <WhatsAppIcon className="w-4 h-4" />
        {labels.askForPrice}
      </a>
      <a
        href={telHref()}
        className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-4 border-[1.5px] border-charcoal text-charcoal bg-canvas font-display font-semibold uppercase tracking-label hover:bg-sand"
        style={{ borderRadius: 2 }}
      >
        <PhoneIcon className="w-4 h-4" />
        {labels.callNow}
      </a>
      {quantityText ? (
        <p className="sm:hidden text-xs text-charcoal/70 mt-1">
          {labels.askForPriceQuantity}: {quantityText}
        </p>
      ) : null}
    </div>
  );
}
