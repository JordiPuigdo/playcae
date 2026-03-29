"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { getTranslations, type Translations } from "@/i18n";
import { useTranslation } from "@/hooks/useTranslation";

type FaqCategoryKey = keyof Translations["faq"]["categories"];
type FaqCategoryFilter = FaqCategoryKey | "all";

interface FaqSectionProps {
  mode: "full" | "compact";
  categoryKey?: FaqCategoryFilter;
  showCta?: boolean;
}

type FaqQuestion = {
  id: string;
  categoryKey: FaqCategoryKey;
  anchor: string;
  question: string;
  answer: string;
};

const CATEGORY_ORDER: FaqCategoryKey[] = ["cae", "software", "playcae"];

function createQuestionId(categoryKey: FaqCategoryKey, index: number) {
  return `${categoryKey}-${index}`;
}

function AccordionList({
  questions,
  openItemId,
  onToggle,
  compact = false,
}: {
  questions: FaqQuestion[];
  openItemId: string | null;
  onToggle: (itemId: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#15345414] bg-white">
      {questions.map((item) => {
        const isOpen = openItemId === item.id;

        return (
          <article
            key={item.id}
            className={`border-b border-[#15345414] last:border-b-0 ${
              isOpen ? "border-l-[3px] border-l-[#EF7932]" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-4 px-4 text-left transition-colors duration-200 hover:bg-[#F2F4F5] ${
                compact ? "py-4" : "py-5"
              }`}
            >
              <span className="text-base font-medium text-[#153454]">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#EF7932] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? "420px" : "0px" }}
            >
              <div className="px-4 pb-5">
                <p className="text-[15px] leading-[1.7] text-[#517B95]">
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function FaqSection({
  mode,
  categoryKey = "all",
  showCta = true,
}: FaqSectionProps) {
  const { locale } = useTranslation();
  const translations = useMemo(() => getTranslations(locale), [locale]);
  const faq = translations.faq;
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setOpenItemId((current) => (current === itemId ? null : itemId));
  };

  const fullModeCategories = useMemo(() => {
    if (categoryKey !== "all") {
      return [categoryKey];
    }

    return CATEGORY_ORDER;
  }, [categoryKey]);

  const compactQuestions = useMemo(() => {
    const allQuestions = CATEGORY_ORDER.flatMap((key) => {
      const category = faq.categories[key];

      return category.questions.map((entry, index) => ({
        id: createQuestionId(key, index),
        categoryKey: key,
        anchor: category.anchor,
        question: entry.q,
        answer: entry.a,
      }));
    });

    const sourceQuestions =
      categoryKey === "all"
        ? allQuestions
        : allQuestions.filter((item) => item.categoryKey === categoryKey);

    const desiredCount = Math.min(5, sourceQuestions.length);
    const selectedByIndex = faq.component.top_questions
      .map((index) => sourceQuestions[index])
      .filter(Boolean);

    const selected = [...selectedByIndex];
    const selectedIds = new Set(selected.map((item) => item.id));

    for (const item of sourceQuestions) {
      if (selected.length >= desiredCount) {
        break;
      }

      if (!selectedIds.has(item.id)) {
        selected.push(item);
        selectedIds.add(item.id);
      }
    }

    return selected.slice(0, desiredCount);
  }, [categoryKey, faq.categories, faq.component.top_questions]);

  if (mode === "compact") {
    return (
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-playBlueDark md:text-4xl">
                {faq.component.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-playBlueLight">
                {faq.component.subtitle}
              </p>
            </div>

            <AccordionList
              questions={compactQuestions}
              openItemId={openItemId}
              onToggle={toggleItem}
              compact
            />

            {showCta ? (
              <div className="mt-6 text-right">
                <Link
                  href={faq.component.cta_url}
                  className="inline-flex items-center gap-2 font-medium text-[#153454] transition-colors hover:text-[#EF7932]"
                >
                  {faq.component.cta_text}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl space-y-12">
          {fullModeCategories.map((key) => {
            const category = faq.categories[key];
            const questions = category.questions.map((entry, index) => ({
              id: createQuestionId(key, index),
              categoryKey: key,
              anchor: category.anchor,
              question: entry.q,
              answer: entry.a,
            }));

            return (
              <section key={key}>
                <h2
                  id={category.anchor}
                  className="mb-6 scroll-mt-28 text-[20px] font-semibold text-[#153454]"
                >
                  {category.title}
                </h2>

                <AccordionList
                  questions={questions}
                  openItemId={openItemId}
                  onToggle={toggleItem}
                />
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
