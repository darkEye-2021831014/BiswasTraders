/**
 * FAQ list. The Q/A text lives in the i18n message bundle
 * (messages/bn.json) under the `faq` key — so it's easy to update
 * without touching code. This file just declares the order of
 * questions and a stable id for each, which the FAQ accordion and the
 * FAQPage JSON-LD both consume.
 *
 * Adding a new question:
 *   1. Add `q<n>` and `a<n>` strings to messages/bn.json under the
 *      `faq` key.
 *   2. Append a new entry to the array below with the same `<n>` id.
 *   3. (Optional) Add a `// TODO(owner): confirm the answer` comment
 *      if the answer is an unconfirmed fact — those should be phrased
 *      to nudge callers to confirm on the phone, not to commit us to
 *      a specific number.
 */

export type FaqEntry = {
  id: string;
  /** The q-key in messages/bn.json (without the namespace prefix). */
  questionKey: string;
  /** The a-key in messages/bn.json (without the namespace prefix). */
  answerKey: string;
  /**
   * If true, the answer is unconfirmed and should make the user call
   * to verify. Renders an extra "please confirm on the call" hint
   * and is tagged in the JSON-LD as a `Question` whose `acceptedAnswer`
   * is intentionally vague.
   *
   * TODO(owner): walk through each FAQ entry and flip `unconfirmed` to
   * true wherever the answer relies on a number / fact we haven't
   * independently verified with the depot.
   */
  unconfirmed: boolean;
};

export const faq: FaqEntry[] = [
  { id: "today-price", questionKey: "q1", answerKey: "a1", unconfirmed: true },
  { id: "delivery-area", questionKey: "q2", answerKey: "a2", unconfirmed: false },
  { id: "lead-time", questionKey: "q3", answerKey: "a3", unconfirmed: true },
  { id: "min-order", questionKey: "q4", answerKey: "a4", unconfirmed: false },
  { id: "payment", questionKey: "q5", answerKey: "a5", unconfirmed: true },
  { id: "quality", questionKey: "q6", answerKey: "a6", unconfirmed: false },
  { id: "truck-access", questionKey: "q7", answerKey: "a7", unconfirmed: false },
  { id: "sample", questionKey: "q8", answerKey: "a8", unconfirmed: false },
];
