"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";

type Labels = {
  product: string;
  area: string;
  areaHint: string;
  unit: string;
  qty: string;
  calc: string;
  result: string;
  resultHint: string;
  footer: string;
};

type ProductItem = { id: string; name: string };

/**
 * Naive in-browser quantity estimator. Never displays a price — only a rough
 * quantity to set expectations. Math runs client-side; no form ever POSTs.
 */
export function Estimator({
  locale,
  products,
  labels,
}: {
  locale: Locale;
  products: ProductItem[];
  labels: Labels;
}) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [unit, setUnit] = useState<"sqft" | "cft" | "pieces" | "tons" | "bags">("sqft");
  const [area, setArea] = useState(1000);
  const [result, setResult] = useState<{ qty: number; unitLabel: string; note: string } | null>(
    null,
  );

  function calc() {
    // Rough rules of thumb — different units per product.
    // For bricks: ~9 bricks per sqft of a 5" wall (very approximate).
    // For sand/khoa: ~1.25 cft concrete per sqft of slab (rough).
    // For cement/cubic work: 0.4 bag per cft concrete (very rough).
    // For rod: ~4 kg per sqft of slab (very rough).
    if (productId === "bricks" && unit === "sqft") {
      const pcs = Math.round(area * 9);
      setResult({
        qty: pcs,
        unitLabel: locale === "bn" ? "পিস" : "pcs",
        note: locale === "bn"
          ? "৫ ইঞ্চি দেয়াল অনুযায়ী। প্রকৃত হিসাব কল করুন।"
          : "For a 5-inch wall. Call us for the real number.",
      });
    } else if (productId === "sand" || productId === "khoa") {
      const qty = unit === "cft" ? area : Math.round(area * 1.25);
      setResult({
        qty,
        unitLabel: "CFT",
        note: locale === "bn"
          ? "স্ল্যাবের আনুমানিক হিসাব। মাটি ভেদে বদলায়।"
          : "Rough for a slab. Varies with design.",
      });
    } else if (productId === "cement") {
      const bags = Math.round(area * 0.4);
      setResult({
        qty: bags,
        unitLabel: locale === "bn" ? "বস্তা" : "bags",
        note: locale === "bn"
          ? "RCC স্ল্যাব অনুযায়ী। সঠিক মিশ্রণ কল করে জানুন।"
          : "For RCC slabs. Call to confirm the mix.",
      });
    } else if (productId === "rod") {
      const kg = Math.round(area * 4);
      setResult({
        qty: kg,
        unitLabel: locale === "bn" ? "কেজি" : "kg",
        note: locale === "bn"
          ? "সাধারণ স্ল্যাব। কলাম/বিমে আরও বেশি।"
          : "Typical slab. Columns/beams need more.",
      });
    } else {
      setResult({
        qty: area,
        unitLabel: "",
        note: locale === "bn"
          ? "এই এককের জন্য সাধারণ হিসাব নেই।"
          : "No general rule for this unit.",
      });
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[11px] uppercase tracking-eyebrow font-display text-charcoal/70">
            {labels.product}
          </span>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 block w-full bg-canvas border-[1.5px] border-mortar h-12 px-3 focus:border-brick focus:outline-none"
            style={{ borderRadius: 2 }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-eyebrow font-display text-charcoal/70">
            {labels.unit}
          </span>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
            className="mt-1 block w-full bg-canvas border-[1.5px] border-mortar h-12 px-3 focus:border-brick focus:outline-none"
            style={{ borderRadius: 2 }}
          >
            <option value="sqft">sq ft / বর্গফুট</option>
            <option value="cft">CFT / সিএফটি</option>
            <option value="pieces">pieces / পিস</option>
            <option value="tons">tons / টন</option>
            <option value="bags">bags / বস্তা</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-[11px] uppercase tracking-eyebrow font-display text-charcoal/70">
          {labels.area}
        </span>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={area}
          onChange={(e) => setArea(Number(e.target.value) || 0)}
          className="mt-1 block w-full bg-canvas border-[1.5px] border-mortar h-12 px-3 tabular focus:border-brick focus:outline-none"
          style={{ borderRadius: 2 }}
          aria-describedby="area-hint"
        />
        <span id="area-hint" className="block text-xs text-charcoal/60 mt-1">
          {labels.areaHint}
        </span>
      </label>

      <button
        type="button"
        onClick={calc}
        className="h-12 px-5 bg-brick text-white font-display font-semibold uppercase tracking-label border border-brick hover:bg-brick-hover hover:shadow-stamp-brick-sm transition-transform duration-100 active:translate-x-[1px] active:translate-y-[1px]"
        style={{ borderRadius: 2 }}
      >
        {labels.calc}
      </button>

      {result ? (
        <div className="border border-line bg-sand p-4" style={{ borderRadius: 2 }}>
          <div className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">{labels.result}</span>
          </div>
          <div className="font-display text-3xl tabular">
            {result.qty.toLocaleString(locale === "bn" ? "bn-BD" : "en-US")} {result.unitLabel}
          </div>
          <p className="mt-2 text-sm text-charcoal/80">{result.note}</p>
          <p className="text-xs text-charcoal/60 mt-2 italic">{labels.resultHint}</p>
        </div>
      ) : null}

      <p className="text-xs text-charcoal/60 border-t border-line pt-3">{labels.footer}</p>
    </div>
  );
}
