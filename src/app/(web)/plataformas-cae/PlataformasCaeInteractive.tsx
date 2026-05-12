"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, Circle } from "lucide-react";

type TocItem = {
  id: string;
  text: string;
};

const checklistItems = [
  "¿Valida documentos automáticamente?",
  "¿Bloquea accesos si hay documentación caducada?",
  "¿Las contratas pueden subir docs gratis?",
  "¿Está operativa en menos de 1 semana?",
  "¿El precio es fijo sin sorpresas?",
  "¿Tiene soporte en español?",
  "¿Cumple RGPD con servidores en España/EU?",
  "¿Genera informes para inspecciones?",
  "¿Tiene alertas automáticas de caducidad?",
  "¿Se integra con control de acceso físico?",
];

export function PlataformasCaeTableOfContents() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("main h2[id]")
    );

    const items = headings
      .map((heading) => ({
        id: heading.id,
        text: heading.textContent?.trim() ?? "",
      }))
      .filter((item) => item.text.length > 0);

    setTocItems(items);
    setActiveSection(items[0]?.id ?? "");

    if (items.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -62% 0px",
        threshold: [0.1, 0.3, 0.6],
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(id);
    setIsTocOpen(false);
  };

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-lg border border-playBlueLight/20 bg-white shadow-sm">
        <button
          type="button"
          className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-playBlueDark lg:pointer-events-none"
          aria-expanded={isTocOpen}
          onClick={() => setIsTocOpen((current) => !current)}
        >
          Tabla de contenidos
          <ChevronDown
            className={`h-5 w-5 text-playBlueLight transition-transform lg:hidden ${
              isTocOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <nav
          className={`border-t border-playBlueLight/10 px-5 pb-5 lg:block ${
            isTocOpen ? "block" : "hidden"
          }`}
          aria-label="Tabla de contenidos"
        >
          <ol className="space-y-2 pt-4 text-sm">
            {tocItems.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => handleAnchorClick(event, item.id)}
                  className={`flex gap-2 rounded-md px-2 py-2 transition-colors ${
                    activeSection === item.id
                      ? "bg-playOrange/10 font-semibold text-playBlueDark"
                      : "text-playBlueLight hover:bg-playGrey hover:text-playBlueDark"
                  }`}
                >
                  <span className="font-mono text-xs text-playOrange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </aside>
  );
}

export function PlataformasCaeChecklist() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    checklistItems.map(() => false)
  );

  const toggleItem = (index: number) => {
    setCheckedItems((current) =>
      current.map((value, itemIndex) => (itemIndex === index ? !value : value))
    );
  };

  const checkedCount = checkedItems.filter(Boolean).length;

  return (
    <section id="checklist-seleccion" className="scroll-mt-28">
      <div className="rounded-lg border border-playBlueLight/20 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-playOrange">
              Checklist gratuito
            </p>
            <h2
              id="checklist-de-seleccion"
              className="scroll-mt-28 text-3xl font-bold text-playBlueDark"
            >
              Checklist de selección
            </h2>
            <p className="mt-3 max-w-2xl text-playBlueLight">
              Marca los criterios que tu próxima plataforma CAE debería cumplir
              antes de pedir demo o firmar contrato.
            </p>
          </div>
          <div className="rounded-lg bg-playGrey px-4 py-3 text-sm font-semibold text-playBlueDark">
            {checkedCount}/10 criterios cubiertos
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {checklistItems.map((item, index) => {
            const isChecked = checkedItems[index];

            return (
              <button
                key={item}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggleItem(index)}
                className={`flex min-h-16 items-start gap-3 rounded-lg border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-playOrange focus:ring-offset-2 ${
                  isChecked
                    ? "border-playGreen bg-playGreen/10 text-playBlueDark"
                    : "border-playBlueLight/20 bg-white text-playBlueLight hover:border-playBlueLight/50"
                }`}
              >
                {isChecked ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-playGreen" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-playBlueLight/60" />
                )}
                <span className="font-medium">{item}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
