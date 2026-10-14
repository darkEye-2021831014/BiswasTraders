import type { L10n } from "@/i18n/l10n";

export type ProductVariant = {
  id: string;
  name: L10n;
  /** short clarifying note shown beside the variant name */
  note?: L10n;
};

export type ProductSpec = {
  label: L10n;
  value: L10n;
};

/** What the call/WhatsApp customer should tell us when they phone us. */
export type ProductAsk = L10n;

export type Product = {
  slug: string;
  order: number;
  name: L10n;
  /** One-line pitch shown in cards and at the top of the detail page. */
  shortDescription: L10n;
  /** How this item is sold (e.g. "per 1,000 pcs" / "per CFT"). */
  soldBy: L10n;
  variants: ProductVariant[];
  specs: ProductSpec[];
  /** Common uses around a building site. */
  uses: L10n[];
  /** Things the customer should mention when calling. */
  askOnCall: ProductAsk[];
  /** Brand names usually carried, if any. Empty unless the owner confirms. */
  brands: string[];
  hero?: boolean;
  image: {
    src: string;
    alt: L10n;
  };
};

export const products: Product[] = [
  {
    slug: "bricks",
    order: 1,
    hero: true,
    name: {
      bn: "ইট",
      en: "Bricks",
    },
    shortDescription: {
      bn: "ভাটার ইট, সরাসরি সিঙ্গাইর থেকে।",
      en: "Kiln-fired bricks, sourced direct from Singair.",
    },
    soldBy: {
      bn: "হাজার পিস / ট্রাক",
      en: "Per 1,000 pcs / per truck",
    },
    variants: [
      {
        id: "auto-brick",
        name: { bn: "অটো ইট", en: "Auto brick" },
        // TODO(owner): confirm — first-class machine-moulded kiln brick.
        note: { bn: "যন্ত্রে তৈরি, মসৃণ", en: "Machine-moulded, even" },
      },
      {
        id: "picket-brick",
        name: { bn: "পিকেট ইট", en: "Picket brick" },
        // TODO(owner): confirm — first-class hand-picked kiln brick.
        note: { bn: "হাতে বাছাই, প্রথম শ্রেণি", en: "Hand-picked, first grade" },
      },
      {
        id: "jhama-brick",
        name: { bn: "ঝামা ইট", en: "Jhama brick" },
        // TODO(owner): confirm — over-burnt brick for sub-base / RCC.
        note: { bn: "বেশি পোড়া, ভারী কাজে", en: "Over-burnt, for sub-base & RCC" },
      },
    ],
    specs: [
      {
        label: { bn: "উৎস", en: "Source" },
        // TODO(owner): confirm actual kiln name / village.
        value: { bn: "সিঙ্গাইর এলাকার ভাটা", en: "Kilns around Singair" },
      },
      {
        label: { bn: "সাইজ", en: "Size" },
        // TODO(owner): confirm size (BD standard 9.5" x 4.5" x 2.75"?).
        value: { bn: "স্ট্যান্ডার্ড সাইজ", en: "Standard size" },
      },
      {
        label: { bn: "প্রকার", en: "Variants" },
        value: { bn: "অটো / পিকেট / ঝামা", en: "Auto / Picket / Jhama" },
      },
      {
        label: { bn: "সরবরাহ", en: "Supply" },
        value: { bn: "প্রতিদিন স্টক", en: "Daily stock" },
      },
    ],
    uses: [
      { bn: "বাড়ির দেয়াল ও পার্টিশন", en: "Walls & partitions of houses" },
      { bn: "বাড়ির পিলার ও লিন্টেল", en: "Pillars & lintels" },
      { bn: "বাউন্ডারি ও গেট", en: "Boundary walls & gates" },
      { bn: "ঝামা: সাব-বেস ও আরসিসি ফিল", en: "Jhama: sub-base & RCC fill" },
    ],
    askOnCall: [
      { bn: "কোন ধরনের ইট — অটো, পিকেট, নাকি ঝামা", en: "Which brick — auto, picket, or jhama" },
      { bn: "কত হাজার পিস বা কত ট্রাক", en: "How many thousand pieces or trucks" },
      { bn: "ডেলিভারির ঠিকানা ও রাস্তার ধরন", en: "Delivery address & road condition" },
    ],
    brands: [],
    image: {
      src: "/images/products/bricks.jpg",
      alt: {
        bn: "সিঙ্গাইরের ভাটা থেকে আসা ইটের স্তূপ",
        en: "Stacks of bricks from the Singair kilns",
      },
    },
  },
  {
    slug: "sand",
    order: 2,
    name: {
      bn: "বালু",
      en: "Sand",
    },
    shortDescription: {
      bn: "নদীর বালু, সরাসরি ঘাট থেকে।",
      en: "River sand, sourced direct from the river bank.",
    },
    soldBy: {
      bn: "সিএফটি / ট্রাক",
      en: "Per CFT / per truck",
    },
    variants: [
      {
        id: "sylhet-sand",
        name: { bn: "সিলেট বালু", en: "Sylhet sand" },
        note: { bn: "কাস্টিং ও শক্ত কাজে", en: "For casting & heavy work" },
      },
      {
        id: "plaster-sand",
        name: { bn: "প্লাস্টার বালু", en: "Plaster sand" },
        note: { bn: "মসৃণ প্লাস্টারের জন্য", en: "For smooth plaster" },
      },
      {
        id: "vitti-sand",
        name: { bn: "ভিটি বালু", en: "Vitti sand" },
        note: { bn: "ফিলিং ও ভিটি কাজে", en: "For filling & site base" },
      },
    ],
    specs: [
      {
        label: { bn: "উৎস", en: "Source" },
        // TODO(owner): confirm river name or quarry.
        value: { bn: "নদীর বালু, স্থানীয় সরবরাহকারী", en: "River sand, local supplier" },
      },
      {
        label: { bn: "দানার আকার", en: "Grain" },
        // TODO(owner): FM rating if available.
        value: { bn: "মিডিয়াম থেকে মোটা", en: "Medium to coarse" },
      },
      {
        label: { bn: "প্রকার", en: "Variants" },
        value: { bn: "সিলেট / প্লাস্টার / ভিটি", en: "Sylhet / Plaster / Vitti" },
      },
      {
        label: { bn: "সরবরাহ", en: "Supply" },
        value: { bn: "ট্রাকে দরজায়", en: "By truck, to your gate" },
      },
    ],
    uses: [
      { bn: "প্লাস্টার ও রাজমিস্ত্রির কাজ", en: "Plastering & masonry" },
      { bn: "সিলেট বালু: RCC ও কলাম ঢালাই", en: "Sylhet sand: RCC & column casting" },
      { bn: "ভিটি বালু: জায়গা ভরাট", en: "Vitti sand: site filling" },
    ],
    askOnCall: [
      { bn: "কোন ধরনের বালু — সিলেট, প্লাস্টার নাকি ভিটি", en: "Which sand — Sylhet, plaster, or vitti" },
      { bn: "কত সিএফটি বা কত ট্রাক", en: "How many CFT or trucks" },
      { bn: "সাইটে রাস্তার অবস্থা কেমন", en: "Road condition at the site" },
    ],
    brands: [],
    image: {
      src: "/images/products/sand.jpg",
      alt: {
        bn: "নদী থেকে আসা বালুর স্তূপ",
        en: "Pile of river sand",
      },
    },
  },
  {
    slug: "khoa",
    order: 3,
    name: {
      bn: "খোয়া / পাথর",
      en: "Khoa / stone chips",
    },
    shortDescription: {
      bn: "খোয়া আর পাথর কুচি, RCC ও বেজমেন্টের জন্য।",
      en: "Khoa and stone chips for RCC and bases.",
    },
    soldBy: {
      bn: "সিএফটি / ট্রাক",
      en: "Per CFT / per truck",
    },
    variants: [
      {
        id: "brick-khoa",
        name: { bn: "ইটের খোয়া", en: "Brick khoa" },
        note: { bn: "ইট ভাঙা, বেজ ফিলে", en: "Crushed brick, for base fill" },
      },
      {
        id: "stone-chips",
        name: { bn: "পাথর কুচি", en: "Stone chips" },
        note: { bn: "RCC ও ঢালাইয়ের জন্য", en: "For RCC and casting" },
      },
    ],
    specs: [
      {
        label: { bn: "উৎস", en: "Source" },
        // TODO(owner): confirm quarry or crusher name.
        value: { bn: "স্থানীয় ক্রাশার", en: "Local crusher" },
      },
      {
        label: { bn: "সাইজ", en: "Size" },
        // TODO(owner): confirm size range (e.g. 3/4", 1/2").
        value: { bn: "মিক্স সাইজ", en: "Mixed size" },
      },
      {
        label: { bn: "প্রকার", en: "Variants" },
        value: { bn: "ইটের খোয়া / পাথর কুচি", en: "Brick khoa / stone chips" },
      },
    ],
    uses: [
      { bn: "RCC ছাদ ও বিম ঢালাই", en: "RCC roof & beam casting" },
      { bn: "কলাম ও ফাউন্ডেশন", en: "Columns & foundations" },
      { bn: "বেজমেন্ট সাব-বেস", en: "Basement sub-base" },
    ],
    askOnCall: [
      { bn: "ইটের খোয়া নাকি পাথর কুচি", en: "Brick khoa or stone chips" },
      { bn: "কত সিএফটি বা ট্রাক", en: "How many CFT or trucks" },
      { bn: "ঢালাইয়ের তারিখ কবে", en: "Pour date" },
    ],
    brands: [],
    image: {
      src: "/images/products/khoa.jpg",
      alt: {
        bn: "খোয়া ও পাথর কুচির স্তূপ",
        en: "Pile of khoa and stone chips",
      },
    },
  },
  {
    slug: "cement",
    order: 4,
    name: {
      bn: "সিমেন্ট",
      en: "Cement",
    },
    shortDescription: {
      bn: "বস্তায় সিমেন্ট, দরজায় পৌঁছে দিই।",
      en: "Bagged cement, delivered to your gate.",
    },
    soldBy: {
      bn: "৫০ কেজি বস্তা / ট্রাক",
      en: "Per 50 kg bag / per truck",
    },
    variants: [],
    specs: [
      {
        label: { bn: "প্রকার", en: "Type" },
        // TODO(owner): confirm grade you supply (e.g. OPC, PSC).
        value: { bn: "সাধারণ গ্রেড", en: "General grade" },
      },
      {
        label: { bn: "বস্তার ওজন", en: "Bag weight" },
        value: { bn: "৫০ কেজি", en: "50 kg" },
      },
      {
        label: { bn: "ব্র্যান্ড", en: "Brands" },
        // TODO(owner): list brands you regularly stock.
        value: { bn: "কল করে জানুন", en: "Call to confirm" },
      },
    ],
    uses: [
      { bn: "প্লাস্টার ও মেঝে ঢালাই", en: "Plaster & floor casting" },
      { bn: "টাইলস ও ফিক্সচার বসানো", en: "Tiles & fixture fixing" },
      { bn: "RCC ঢালাই", en: "RCC casting" },
    ],
    askOnCall: [
      { bn: "কত বস্তা লাগবে", en: "How many bags" },
      { bn: "কোন গ্রেড বা ব্র্যান্ড চান", en: "Which grade or brand" },
      { bn: "কবে দরকার", en: "When do you need it" },
    ],
    brands: [],
    image: {
      src: "/images/products/cement.jpg",
      alt: {
        bn: "সিমেন্টের বস্তার স্তূপ",
        en: "Stack of cement bags",
      },
    },
  },
  {
    slug: "rod",
    order: 5,
    name: {
      bn: "রড",
      en: "Rebar / Rod",
    },
    shortDescription: {
      bn: "নির্মাণ রড, টনে বা কেজিতে।",
      en: "Construction rebar, by the ton or by the kilogram.",
    },
    soldBy: {
      bn: "টন / কেজি",
      en: "Per ton / per kg",
    },
    variants: [],
    specs: [
      {
        label: { bn: "ধরন", en: "Type" },
        // TODO(owner): confirm grade (e.g. 400W, 500W).
        value: { bn: "গ্রেডের জন্য কল করুন", en: "Call for grade" },
      },
      {
        label: { bn: "সাইজ", en: "Size" },
        // TODO(owner): confirm size range (e.g. 8mm, 10mm, 12mm, 16mm, 20mm, 25mm).
        value: { bn: "বিভিন্ন সাইজ", en: "Mixed sizes" },
      },
    ],
    uses: [
      { bn: "RCC কলাম, বিম ও ছাদ", en: "RCC columns, beams & roofs" },
      { bn: "ফাউন্ডেশন ও ডিভাইডিং ওয়াল", en: "Foundation & dividing walls" },
    ],
    askOnCall: [
      { bn: "কোন গ্রেড চান — ৪০০ ডব্লিউ নাকি ৫০০ ডব্লিউ", en: "Which grade — 400W or 500W" },
      { bn: "কোন কোন সাইজ লাগবে", en: "Which sizes you need" },
      { bn: "টনে নাকি কেজিতে হিসাব", en: "Ton or kg" },
    ],
    brands: [],
    image: {
      src: "/images/products/rod.jpg",
      alt: {
        bn: "নির্মাণ রডের বান্ডেল",
        en: "Bundle of construction rebar",
      },
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getHeroProduct(): Product {
  const hero = products.find((p) => p.hero);
  // We always seed bricks as hero; the assert keeps types honest.
  if (!hero) {
    const bricks = products[0];
    if (!bricks) throw new Error("No products seeded");
    return bricks;
  }
  return hero;
}
