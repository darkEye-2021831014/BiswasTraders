import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SpecTable } from "@/components/ui/SpecTable";
import { BrickDivider } from "@/components/ui/BrickDivider";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ProductImage } from "@/components/product/ProductImage";
import type { Locale } from "@/i18n/config";
import type { L10n } from "@/i18n/l10n";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const TOKENS = [
  { name: "Canvas", value: "#FAF8F5", cls: "bg-canvas text-charcoal border" },
  { name: "Sand", value: "#EDE4D8", cls: "bg-sand text-charcoal border" },
  { name: "Brick", value: "#A13828", cls: "bg-brick text-white border" },
  { name: "Brick Hover", value: "#812113", cls: "bg-brick-hover text-white border" },
  { name: "Charcoal", value: "#1F2421", cls: "bg-charcoal text-white border" },
  { name: "Navy (logo)", value: "#001A2B", cls: "bg-navy text-white border" },
  { name: "Orange (logo)", value: "#FD5500", cls: "bg-orange text-navy border" },
  { name: "Mortar", value: "#7E8287", cls: "bg-mortar text-white border" },
  { name: "WA Green", value: "#25D366", cls: "bg-wa text-white border" },
  { name: "Error", value: "#BA1A1A", cls: "bg-error text-white border" },
  { name: "Line", value: "#D1D5DB", cls: "bg-line text-charcoal border" },
];

const BANGLA_SAMPLE: L10n = {
  bn: "প্রতিষ্ঠান, সংগ্রহ, ইটের খোয়া, ঝামা ইট, পিকেট ইট, সিমেন্ট, রড, বালু, প্লাস্টার, কল, WhatsApp।",
  en: "Bengla conjunct-heavy text — প্রতিষ্ঠান, সংগ্রহ, ইটের খোয়া",
};

export default async function StyleguidePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });
  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <SectionHeading
            eyebrow="INTERNAL"
            title={t("styleguide.title")}
            subtitle={t("styleguide.subtitle")}
          />
          <Badge tone="orange">noindex</Badge>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">{t("styleguide.tokensTitle")}</h2>
        <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {TOKENS.map((tk) => (
            <li key={tk.name} className="border border-line bg-canvas" style={{ borderRadius: 2 }}>
              <div className={`h-16 ${tk.cls}`} />
              <div className="p-3">
                <div className="font-display text-sm">{tk.name}</div>
                <div className="text-[11px] text-charcoal/70 font-mono">{tk.value}</div>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl font-semibold">{t("styleguide.fontsTitle")}</h2>
        <Card className="mt-4 space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow font-display text-charcoal/60">
              Space Grotesk (display)
            </div>
            <div className="text-2xl md:text-4xl font-display font-semibold">
              0123456789 · 1,000 pcs · 50 kg
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow font-display text-charcoal/60">
              Plus Jakarta Sans (body)
            </div>
            <p className="max-w-prose text-sm md:text-base">
              Trusted bricks, one address. For a home, a flat, or a large project — we deliver
              bricks, sand, khoa, cement and rebar on time. Our own trucks, our own people.
            </p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow font-display text-charcoal/60">
              Anek Bangla (heading)
            </div>
            <div className="text-2xl md:text-3xl bn font-semibold">
              ভরসার ইট, সঠিক সরবরাহ
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow font-display text-charcoal/60">
              Hind Siliguri (body)
            </div>
            <p className="bn text-sm md:text-base max-w-prose">{BANGLA_SAMPLE.bn}</p>
            <p className="text-xs text-charcoal/60 mt-2">
              Bangla line-height is set to +10% (1.71) to keep vowel marks from clipping.
            </p>
          </div>
        </Card>

        <h2 className="mt-12 text-2xl font-semibold">{t("styleguide.componentsTitle")}</h2>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">Buttons</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="dark">Dark</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <ButtonLink href="#">As link</ButtonLink>
            </div>
            <div className="mt-4 text-[11px] text-charcoal/60">All buttons have 48px height min.</div>
          </Card>

          <Card>
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">Badges / Stamps</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge tone="dark">Dark</Badge>
              <Badge tone="orange">Orange</Badge>
              <Badge tone="brick">Brick</Badge>
              <Badge tone="navy">Navy</Badge>
            </div>
          </Card>

          <Card>
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">Call / WhatsApp</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <CallButton label="Call now" />
              <WhatsAppButton label="WhatsApp" locale={params.locale} />
            </div>
          </Card>

          <Card>
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">Spec table (zebra)</span>
            </div>
            <SpecTable
              locale={params.locale}
              rows={[
                {
                  label: { bn: "উৎস", en: "Source" },
                  value: { bn: "সিঙ্গাইর", en: "Singair" },
                },
                {
                  label: { bn: "সাইজ", en: "Size" },
                  value: { bn: "স্ট্যান্ডার্ড", en: "Standard" },
                },
                {
                  label: { bn: "মূল্য", en: "Price" },
                  value: { bn: "কল করুন", en: "Call us" },
                },
              ]}
            />
          </Card>

          <Card className="md:col-span-2">
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">Product image (placeholders)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(["brick", "sand", "charcoal", "navy", "orange"] as const).map((v) => (
                <div key={v}>
                  <ProductImage
                    slug={v}
                    alt={{ bn: v, en: v }}
                    variant={v}
                    aspect="1/1"
                  />
                  <div className="mt-2 text-[11px] uppercase tracking-eyebrow text-charcoal/60">
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-charcoal/60 mt-3">
              The placeholder is themed to the product. Drop a real JPG at
              <code className="font-mono"> /public/images/products/&lt;slug&gt;.jpg</code> and the
              component will switch to it.
            </p>
          </Card>

          <Card className="md:col-span-2">
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">Brick course motif</span>
            </div>
            <BrickDivider tone="navy" />
            <div className="h-3" />
            <BrickDivider tone="sand" />
            <div className="h-3" />
            <div className="h-20 brick-course" />
          </Card>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">{t("styleguide.statesTitle")}</h2>
        <Card className="mt-4 space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow font-display text-charcoal/60">
              Focus ring
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button>Tab to me</Button>
              <ButtonLink href="#">Or me</ButtonLink>
              <a className="px-2 py-1 underline" href="#">Plain link</a>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow font-display text-charcoal/60">
              Disabled
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}
