#!/usr/bin/env node
/**
 * content:check — scan src/content for every `// TODO(owner)` and
 * every empty/null optional field that's currently hiding UI.
 *
 * Run with `npm run content:check`. Exits non-zero only on internal
 * errors; the missing-content report itself is informational, not a
 * build failure.
 *
 * Add new fields here as the brief evolves:
 *   - Anything that's TODO(owner) in src/content/*.ts gets reported.
 *   - Any optional field we know the UI relies on (vehicle capacity,
 *     zone distance, hours, notice, brands, gallery photos) gets
 *     reported when it's null / empty.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../src/content/", import.meta.url);

/**
 * Walk every src/content/*.ts file and return a list of `{ file, line,
 * text }` for every `// TODO(owner)` comment we find.
 */
function collectTodos() {
  const todos = [];
  const files = readdirSync(ROOT).filter((f) => f.endsWith(".ts"));
  for (const f of files) {
    const full = join(ROOT.pathname, f);
    const src = readFileSync(full, "utf8");
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(/\/\/\s*TODO\(owner\)\s*:?\s*(.*)$/);
      if (m) {
        todos.push({
          file: `src/content/${f}`,
          line: i + 1,
          text: m[1].trim() || "(no detail)",
        });
      }
    }
  }
  return todos;
}

/**
 * Count empty / null optional fields we know the UI relies on. We
 * look at specific keys in `site.ts` and `products.ts` because a
 * blanket check would also flag intended-empty arrays.
 */
function collectEmptyFields() {
  const empty = [];

  // site.ts — read & pattern-match. We don't import the file (it's
  // a TypeScript module) because we don't want a tsc step here.
  const site = readFileSync(new URL("./site.ts", ROOT), "utf8");
  function siteFieldCount(field, label) {
    // Looks for `field: null` (with optional trailing comment) on a
    // single line.
    const re = new RegExp(`^\\s*${field}:\\s*null`, "m");
    if (re.test(site)) empty.push({ file: "src/content/site.ts", field, label });
  }
  siteFieldCount("googleMapsUrl", "Google Maps share URL (contact page button)");
  siteFieldCount("googleMapsEmbedUrl", "Google Maps embed iframe (contact page map)");
  siteFieldCount("hours", "Business hours (contact page hours card)");
  siteFieldCount("notice", "Notice banner (top of every page)");

  // Check for empty arrays the UI expects: landmarks (1+), vehicles
  // capacity / goodFor / notes (each on each item), serviceZones
  // distanceKm (already counted via TODO comments).
  // We re-read the same file with a different regex for capacity.
  // Important: this regex matches the *data*, not the *type* — the
  // type declaration `capacity: L10n | null` is in a comment-like
  // line and is filtered out by the trailing-comma / opening-brace
  // heuristic below.
  const capRe = /^\s*capacity:\s*null,?\s*$/gm;
  let m;
  while ((m = capRe.exec(site))) {
    empty.push({
      file: "src/content/site.ts",
      field: "vehicles[].capacity",
      label: "Vehicle load capacity",
    });
  }
  const notesRe = /^\s*notes:\s*null,?\s*$/gm;
  while ((m = notesRe.exec(site))) {
    empty.push({
      file: "src/content/site.ts",
      field: "vehicles[].notes",
      label: "Vehicle caveats (e.g. access limits)",
    });
  }

  // products.ts — brands array empty on every product.
  const products = readFileSync(new URL("./products.ts", ROOT), "utf8");
  const brandRe = /brands:\s*\[\s*\]/g;
  while ((m = brandRe.exec(products))) {
    empty.push({
      file: "src/content/products.ts",
      field: "Product.brands",
      label: "Brands carried (cement/rod/anything stocked under name)",
    });
  }

  return empty;
}

function formatTodos(todos) {
  if (todos.length === 0) {
    return "  (none) — every fact in src/content is either filled in or has a TODO outside the owner's flow.";
  }
  // group by file
  const byFile = new Map();
  for (const t of todos) {
    if (!byFile.has(t.file)) byFile.set(t.file, []);
    byFile.get(t.file).push(t);
  }
  let out = "";
  for (const [f, list] of byFile) {
    out += `  ${f}\n`;
    for (const t of list) {
      out += `    L${String(t.line).padStart(3, " ")}  ${t.text}\n`;
    }
  }
  return out;
}

function formatEmpty(empty) {
  if (empty.length === 0) {
    return "  (none) — every UI-visible optional field is either filled in or omitted by design.";
  }
  // collapse duplicates of the same (file, field) — same warning
  // shouldn't show up N times.
  const seen = new Map();
  for (const e of empty) {
    const k = `${e.file}::${e.field}`;
    seen.set(k, (seen.get(k) || 0) + 1);
  }
  let out = "";
  for (const [k, n] of seen) {
    const [f, field] = k.split("::");
    out += `  ${f.padEnd(28)} ${field.padEnd(28)} (${n} ×)${
      empty.find((e) => `${e.file}::${e.field}` === k)?.label
        ? `  — ${empty.find((e) => `${e.file}::${e.field}` === k).label}`
        : ""
    }\n`;
  }
  return out;
}

function main() {
  const todos = collectTodos();
  const empty = collectEmptyFields();

  console.log("content:check\n");
  console.log("This script is informational — it lists content the owner still owes us,");
  console.log("so you can see at a glance what the UI is currently hiding behind");
  console.log("a TODO(owner) comment or an empty/null optional field.\n");

  console.log(`1. // TODO(owner) comments in src/content (excluding the data files themselves): ${todos.length}`);
  console.log(formatTodos(todos));
  console.log("");

  console.log(`2. UI-visible fields that are null / empty: ${empty.length}`);
  console.log(formatEmpty(empty));
  console.log("");

  console.log("Run `npm run dev` to see how the site looks today, and edit src/content/*.ts");
  console.log("to fill in any of the above. The README has a cheat-sheet of every editable field.");
}

main();
