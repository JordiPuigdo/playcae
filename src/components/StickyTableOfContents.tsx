"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type TocItem = {
  id: string;
  text: string;
};

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function StickyTableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("main h2")
    );

    if (headings.length === 0) {
      setItems([]);
      return;
    }

    const usedIds = new Set<string>();
    headings.forEach((heading) => {
      if (heading.id) {
        usedIds.add(heading.id);
      }
    });

    const tocItems: TocItem[] = [];

    headings.forEach((heading) => {
      const text = heading.textContent?.trim() ?? "";
      if (!text) {
        return;
      }

      let id = heading.id;
      if (!id) {
        const baseId = slugify(text) || "section";
        let uniqueId = baseId;
        let suffix = 2;
        while (usedIds.has(uniqueId) || document.getElementById(uniqueId)) {
          uniqueId = `${baseId}-${suffix}`;
          suffix += 1;
        }
        heading.id = uniqueId;
        id = uniqueId;
      }

      usedIds.add(id);
      tocItems.push({ id, text });
    });

    setItems(tocItems);
  }, []);

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <div className="md:hidden bg-playGrey rounded-2xl border border-playBlueLight/10">
        <button
          type="button"
          className="w-full flex items-center justify-between px-5 py-4 text-playBlueDark font-semibold"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Tabla de contenidos
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {isOpen ? (
          <ul className="px-5 pb-5 space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => handleAnchorClick(event, item.id)}
                  className="text-playBlueLight hover:text-playOrange transition-colors"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="hidden md:block">
        <div className="sticky top-24 bg-playGrey rounded-2xl border border-playBlueLight/10 p-6">
          <p className="text-xs uppercase tracking-wider text-playBlueLight font-semibold mb-4">
            Tabla de contenidos
          </p>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => handleAnchorClick(event, item.id)}
                  className="text-playBlueDark hover:text-playOrange transition-colors"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
