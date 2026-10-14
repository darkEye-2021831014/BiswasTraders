/**
 * Four short commitments shown on the home page. The titles and bodies are
 * intentionally conservative and generic — these are promises the owner
 * should approve before they go public. Each entry is paired with a
 * translation key (in messages/*.json) so the home page can render both
 * languages from one source.
 *
 * The order and the icon shape are fixed in the design; only the label/body
 * are content. If the owner rejects any line, remove it from this list and
 * the home page will render fewer cards.
 */
export type TrustPromise = {
  id: "measure" | "rate" | "transport" | "checked";
  /** Shape drawn next to the title. Visual only, no business meaning. */
  shape: "ruler" | "scale" | "truck" | "check";
  titleKey: "trust.promise1Title" | "trust.promise2Title" | "trust.promise3Title" | "trust.promise4Title";
  bodyKey: "trust.promise1Body" | "trust.promise2Body" | "trust.promise3Body" | "trust.promise4Body";
};

export const trustPromises: TrustPromise[] = [
  {
    id: "measure",
    // TODO(owner): confirm wording before going live.
    shape: "ruler",
    titleKey: "trust.promise1Title",
    bodyKey: "trust.promise1Body",
  },
  {
    id: "rate",
    // TODO(owner): confirm wording before going live.
    shape: "scale",
    titleKey: "trust.promise2Title",
    bodyKey: "trust.promise2Body",
  },
  {
    id: "transport",
    // TODO(owner): confirm wording before going live.
    shape: "truck",
    titleKey: "trust.promise3Title",
    bodyKey: "trust.promise3Body",
  },
  {
    id: "checked",
    // TODO(owner): confirm wording before going live.
    shape: "check",
    titleKey: "trust.promise4Title",
    bodyKey: "trust.promise4Body",
  },
];