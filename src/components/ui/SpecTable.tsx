import type { L10n } from "@/i18n/l10n";
import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/l10n";

type Row = { label: L10n; value: L10n };

/**
 * Zebra spec table — alternating sand/canvas rows, 1px mortar dividers.
 * Keys are bold charcoal, values in tabular numerals.
 */
export function SpecTable({ rows, locale }: { rows: Row[]; locale: Locale }) {
  if (rows.length === 0) return null;
  return (
    <table className="spec-table w-full border border-line text-sm">
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={`${pick(row.label, locale)}-${i}`}
            className={i % 2 === 0 ? "bg-canvas" : "bg-sand"}
          >
            <th className="text-left font-semibold text-charcoal px-3 py-2 border-b border-line/70 align-top w-1/3">
              {pick(row.label, locale)}
            </th>
            <td className="px-3 py-2 border-b border-line/70 text-charcoal/90 align-top">
              {pick(row.value, locale)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
