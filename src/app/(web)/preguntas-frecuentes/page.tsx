import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { MessageCircleQuestion } from "lucide-react";
import FaqSection from "@/components/FaqSection";
import { getServerTranslations, type Translations } from "@/i18n/server";

type FaqCategoryKey = keyof Translations["faq"]["categories"];

const CATEGORY_ORDER: FaqCategoryKey[] = ["cae", "software", "playcae"];
const FAQ_CANONICAL_URL = "https://www.playcae.com/preguntas-frecuentes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations();

  return {
    title: t.faq.page.meta_title,
    description: t.faq.page.meta_description,
    alternates: {
      canonical: FAQ_CANONICAL_URL,
    },
  };
}

export default async function PreguntasFrecuentesPage() {
  const t = await getServerTranslations();

  const faqCategories = CATEGORY_ORDER.map((key) => ({
    key,
    title: t.faq.categories[key].title,
    anchor: t.faq.categories[key].anchor,
    questions: t.faq.categories[key].questions,
  }));

  const quickLinks = t.faq.page.quick_links;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((category) =>
      category.questions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return (
    <main className="relative overflow-hidden">
      <section className="relative bg-playGrey">
        <div
          className="absolute inset-0 bg-gradient-to-br from-playBlueDark/10 via-transparent to-playOrange/10"
          aria-hidden="true"
        />
        <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-playBlueDark/10 px-4 py-2 text-sm font-medium text-playBlueDark">
              <MessageCircleQuestion className="h-4 w-4" />
              {t.faq.page.badge}
            </div>
            <h1 className="text-4xl font-bold leading-tight text-playBlueDark md:text-5xl lg:text-6xl">
              {t.faq.page.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-playBlueLight md:text-xl">
              {t.faq.page.subtitle}
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="h-16 w-full"
          >
            <path
              d="M0,120 C300,20 900,100 1200,40 L1200,120 L0,120 Z"
              className="fill-white"
            />
          </svg>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3">
            {faqCategories.map((category) => (
              <Link
                key={category.key}
                href={`#${category.anchor}`}
                className="rounded-full border border-[#1534541f] bg-white px-5 py-2 text-sm font-medium text-[#153454] transition-colors hover:border-[#EF79324d] hover:bg-[#F2F4F5]"
              >
                {quickLinks[category.key]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection mode="full" />

      <section className="bg-gradient-to-br from-playOrange to-orange-500 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            {t.faq.page.contact_cta_title}
          </h2>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-playOrange shadow-lg transition-colors hover:bg-gray-100"
          >
            {t.faq.page.contact_cta_button}
          </Link>
        </div>
      </section>

      <Script
        id="ld-faq-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
