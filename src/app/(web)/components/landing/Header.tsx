"use client";

import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import {
  Menu,
  X,
  ChevronDown,
  FileCheck2,
  ShieldCheck,
  UserRound,
  ListChecks,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSelector from "@/components/LanguageSelector";

interface MenuItem {
  title: string;
  subtitle: string;
  href: string;
  icon: string | ReactNode;
  iconBg: string;
  badge?: string;
  isNew?: boolean;
}

interface HeaderProps {
  alwaysSolid?: boolean;
}

export default function Header({ alwaysSolid }: HeaderProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [productoOpen, setProductoOpen] = useState(false);
  const [mobileProductoOpen, setMobileProductoOpen] = useState(false);
  const [recursosOpen, setRecursosOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const productoRef = useRef<HTMLDivElement>(null);
  const productoTriggerRef = useRef<HTMLButtonElement>(null);
  const productoPanelRef = useRef<HTMLDivElement>(null);
  const recursosRef = useRef<HTMLDivElement>(null);
  const recursosPanelRef = useRef<HTMLDivElement>(null);

  const moduleItems: MenuItem[] = useMemo(
    () => [
      {
        title: t("nav.productMenu.modules.platform.title"),
        subtitle: t("nav.productMenu.modules.platform.subtitle"),
        href: "/servicios/gestion-documentacion-cae",
        icon: <FileCheck2 className="h-4 w-4" />,
        iconBg: "bg-brand-primary/10 text-brand-primary",
      },
      {
        title: t("nav.productMenu.modules.access.title"),
        subtitle: t("nav.productMenu.modules.access.subtitle"),
        href: "/servicios/control-accesos-fabrica",
        icon: <ShieldCheck className="h-4 w-4" />,
        iconBg: "bg-brand-secondary/10 text-brand-secondary",
      },
      {
        title: t("nav.productMenu.modules.workers.title"),
        subtitle: t("nav.productMenu.modules.workers.subtitle"),
        href: "/servicios/gestion-trabajadores-internos",
        icon: <UserRound className="h-4 w-4" />,
        iconBg: "bg-brand-success/10 text-brand-success",
        badge: t("nav.productMenu.modules.workers.badge"),
      },
    ],
    [t]
  );

  const featureItems: MenuItem[] = useMemo(
    () => [
      {
        title: t("nav.productMenu.features.validation.title"),
        subtitle: t("nav.productMenu.features.validation.subtitle"),
        href: "/plataformas-gestion-documental",
        icon: <ListChecks className="h-4 w-4" />,
        iconBg: "bg-brand-accent/10 text-brand-accent",
      },
      {
        title: t("nav.productMenu.features.access.title"),
        subtitle: t("nav.productMenu.features.access.subtitle"),
        href: "/servicios/control-accesos-fabrica",
        icon: <ShieldCheck className="h-4 w-4" />,
        iconBg: "bg-brand-primary/10 text-brand-primary",
      },
      {
        title: t("nav.productMenu.features.compliance.title"),
        subtitle: t("nav.productMenu.features.compliance.subtitle"),
        href: "/plataformas-cae",
        icon: <FileCheck2 className="h-4 w-4" />,
        iconBg: "bg-brand-secondary/10 text-brand-secondary",
      },
    ],
    [t]
  );

  const resourceItems: MenuItem[] = useMemo(
    () => [
      {
        title: t("nav.whatIsCae"),
        subtitle: t("nav.resourcesMenu.whatIsCaeSubtitle"),
        href: "/que-es-cae",
        icon: <FileCheck2 className="h-4 w-4" />,
        iconBg: "bg-brand-primary/10 text-brand-primary",
      },
      {
        title: t("nav.caeAlternatives"),
        subtitle: t("nav.resourcesMenu.caeAlternativesSubtitle"),
        href: "/alternativas-software-cae",
        icon: <ListChecks className="h-4 w-4" />,
        iconBg: "bg-brand-accent/10 text-brand-accent",
      },
      {
        title: t("nav.blog"),
        subtitle: t("nav.resourcesMenu.blogSubtitle"),
        href: "/blog",
        icon: <BookOpen className="h-4 w-4" />,
        iconBg: "bg-brand-secondary/10 text-brand-secondary",
      },
    ],
    [t]
  );

  const handleLogin = () => {
    window.open("/login", "_blank");
    setMenuOpen(false);
    setProductoOpen(false);
    setMobileProductoOpen(false);
    setRecursosOpen(false);
  };

  const isActiveRoute = (href: string) => {
    const route = href.split("#")[0];
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  const forceSolid = alwaysSolid ?? !isHome;
  const isSolid = forceSolid || scrolled || menuOpen;
  // Provisional: ocultamos el bloque de "Funcionalidades" en Producto.
  // Para reactivarlo, cambia este flag a true.
  const showProductFeatures = false;

  useEffect(() => {
    if (!menuOpen) {
      setMobileProductoOpen(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (forceSolid) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceSolid]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        productoRef.current &&
        !productoRef.current.contains(event.target as Node)
      ) {
        setProductoOpen(false);
      }
      if (
        recursosRef.current &&
        !recursosRef.current.contains(event.target as Node)
      ) {
        setRecursosOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (productoOpen) {
          setProductoOpen(false);
          productoTriggerRef.current?.focus();
        }
        if (recursosOpen) {
          setRecursosOpen(false);
        }
      }

      if (
        event.key === "Tab" &&
        productoOpen &&
        productoPanelRef.current &&
        document.activeElement
      ) {
        const focusable = productoPanelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }

      if (
        event.key === "Tab" &&
        recursosOpen &&
        recursosPanelRef.current &&
        document.activeElement
      ) {
        const focusable = recursosPanelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [productoOpen, recursosOpen]);

  const desktopItemClass = (active: boolean) =>
    [
      "group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors duration-150",
      "hover:bg-brand-neutral",
      active
        ? "border-l-2 border-brand-secondary bg-brand-neutral"
        : "border-l-2 border-transparent",
    ].join(" ");

  const mobileItemClass = (active: boolean) =>
    [
      "group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors duration-150",
      "hover:bg-white/10",
      active
        ? "border-l-2 border-brand-secondary bg-brand-neutral text-brand-primary"
        : "border-l-2 border-transparent text-white",
    ].join(" ");

  const desktopNavTextClass = (active = false) =>
    [
      "font-medium transition-colors duration-200",
      active
        ? "text-brand-secondary/80"
        : isSolid
        ? "text-brand-primary/80 hover:text-brand-primary/40"
        : "text-brand-primary/80 hover:text-brand-primary/40",
    ].join(" ");

  const triggerTextClass = (active = false) =>
    ["flex items-center gap-1 transition-colors duration-200", desktopNavTextClass(active)].join(
      " "
    );

  const loginButtonClass = [
    "rounded-full border px-5 py-2 font-semibold transition-all duration-200",
    isSolid
      ? "border-brand-primary text-brand-primary/70 hover:border-brand-primary/40 hover:text-brand-primary hover:bg-brand-primary/10 "
      : "border-brand-primary text-brand-primary/80 hover:border-brand-primary/50 hover:text-brand-primary ",
  ].join(" ");

  const isProductActive = [...moduleItems, ...featureItems].some((item) =>
    isActiveRoute(item.href)
  );
  const isResourcesActive = resourceItems.some((item) => isActiveRoute(item.href));

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-out ${
        isSolid
          ? "border-b border-white/10 bg-white/10 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center transition-transform hover:scale-[1.02]"
          aria-label="Ir al inicio"
        >
          <Image
            src="/assets/playcae.png"
            alt="Logo Play CAE"
            width={120}
            height={40}
            className="select-none"
          />
        </Link>

        <nav className="hidden lg:flex items-center space-x-6 text-brand-primary">
          <div ref={productoRef} className="relative">
            <button
              ref={productoTriggerRef}
              onClick={() => {
                setProductoOpen((prev) => !prev);
                setRecursosOpen(false);
              }}
              aria-expanded={productoOpen}
              aria-haspopup="true"
              className={triggerTextClass(isProductActive)}
            >
              {t("header.product")}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  productoOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              ref={productoPanelRef}
              role="menu"
              aria-label="Producto"
              className={`absolute left-0 top-full z-50 mt-3 min-w-[580px] max-w-[680px] overflow-hidden rounded-b-xl rounded-t-none border border-brand-primary/10 bg-white shadow-[0_8px_32px_rgba(21,52,84,0.12)] transition-all duration-150 ease-out ${
                productoOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <div className={`grid ${showProductFeatures ? "grid-cols-2" : "grid-cols-1"}`}>
                <div className="px-5 py-4">
                  <p className="mb-3 border-b-2 border-brand-secondary pb-1 text-xs font-semibold uppercase tracking-wide text-brand-accent">
                    {t("nav.productMenu.modulesLabel")}
                  </p>
                  <div className="space-y-1">
                    {moduleItems.map((item) => {
                      const active = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setProductoOpen(false)}
                          className={desktopItemClass(active)}
                        >
                          <span
                            className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                          >
                            {item.icon}
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                              {item.title}
                              {item.isNew ? (
                                <span className="rounded-full bg-brand-secondary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                                  {item.badge}
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 block text-xs text-brand-accent">
                              {item.subtitle}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {showProductFeatures && (
                  <div className="border-l border-brand-primary/10 px-5 py-4">
                    <p className="mb-3 border-b-2 border-brand-secondary pb-1 text-xs font-semibold uppercase tracking-wide text-brand-accent">
                      {t("nav.productMenu.featuresLabel")}
                    </p>
                    <div className="space-y-1">
                      {featureItems.map((item) => {
                        const active = isActiveRoute(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            onClick={() => setProductoOpen(false)}
                            className={desktopItemClass(active)}
                          >
                            <span
                              className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                            >
                              {item.icon}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-brand-primary">
                                {item.title}
                              </span>
                              <span className="mt-0.5 block text-xs text-brand-accent">
                                {item.subtitle}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 bg-brand-neutral px-5 py-3">
                <p className="text-xs text-brand-accent">
                  {t("nav.productMenu.footerQuestion")}
                </p>
                <Link
                  href="/contacto"
                  onClick={() => setProductoOpen(false)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary"
                >
                  {t("nav.productMenu.footerCta")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/precios"
            className={desktopNavTextClass(isActiveRoute("/precios"))}
          >
            {t("header.pricing")}
          </Link>

          <div ref={recursosRef} className="relative">
            <button
              onClick={() => {
                setRecursosOpen((prev) => !prev);
                setProductoOpen(false);
              }}
              className={triggerTextClass(isResourcesActive)}
              aria-expanded={recursosOpen}
              aria-haspopup="true"
            >
              {t("header.resources")}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  recursosOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              ref={recursosPanelRef}
              role="menu"
              aria-label={t("header.resources")}
              className={`absolute left-0 top-full z-50 mt-3 min-w-[360px] max-w-[420px] overflow-hidden rounded-b-xl rounded-t-none border border-brand-primary/10 bg-white shadow-[0_8px_32px_rgba(21,52,84,0.12)] transition-all duration-150 ease-out ${
                recursosOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <div className="px-5 py-4">
                <p className="mb-3 border-b-2 border-brand-secondary pb-1 text-xs font-semibold uppercase tracking-wide text-brand-accent">
                  {t("nav.resourcesMenu.label")}
                </p>
                <div className="space-y-1">
                  {resourceItems.map((item) => {
                    const active = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setRecursosOpen(false)}
                        className={desktopItemClass(active)}
                      >
                        <span
                          className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                        >
                          {item.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-brand-primary">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-brand-accent">
                            {item.subtitle}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 bg-brand-neutral px-5 py-3">
                <p className="text-xs text-brand-accent">
                  {t("nav.resourcesMenu.footerQuestion")}
                </p>
                <Link
                  href="/contacto"
                  onClick={() => setRecursosOpen(false)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary"
                >
                  {t("nav.resourcesMenu.footerCta")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/contacto"
            className={desktopNavTextClass(isActiveRoute("/contacto"))}
          >
            {t("header.contact")}
          </Link>

          <Link
            href="/contacto"
            className="rounded-full bg-brand-secondary px-6 py-2 font-semibold text-white shadow-md transition-all hover:bg-brand-secondary/90 hover:scale-[1.03]"
          >
            {t("header.requestDemo")}
          </Link>

          <button
            onClick={handleLogin}
            className={loginButtonClass}
          >
            {t("header.login")}
          </button>

          <LanguageSelector variant="minimal" showName={false} />
        </nav>

        <button
          className="lg:hidden rounded-md p-2 text-white transition hover:bg-white/10"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="animate-fade-in border-t border-white/10 bg-brand-primary shadow-lg lg:hidden">
          <nav className="flex flex-col space-y-1 px-4 py-6" aria-label="Menú móvil">
            <div className="mb-2 border-b border-white/10 pb-4">
              <LanguageSelector variant="default" showName={true} className="w-full" />
            </div>

            <div className="py-2">
              <button
                onClick={() => setMobileProductoOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 font-medium text-white hover:bg-white/10"
                aria-expanded={mobileProductoOpen}
                aria-haspopup="true"
              >
                <span>{t("header.product")}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    mobileProductoOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileProductoOpen && (
                <div className="mt-3 space-y-4 px-1">
                  <div>
                    <p className="mb-2 border-b-2 border-brand-secondary pb-1 text-xs font-semibold uppercase tracking-wide text-brand-accent">
                      {t("nav.productMenu.modulesLabel")}
                    </p>
                    <div className="space-y-1">
                      {moduleItems.map((item) => {
                        const active = isActiveRoute(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            className={mobileItemClass(active)}
                            onClick={() => {
                              setMenuOpen(false);
                              setMobileProductoOpen(false);
                            }}
                          >
                            <span
                              className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                            >
                              {item.icon}
                            </span>
                            <span>
                              <span className="flex items-center gap-2 text-sm font-semibold">
                                {item.title}
                                {item.isNew ? (
                                  <span className="rounded-full bg-brand-secondary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                                    {item.badge}
                                  </span>
                                ) : null}
                              </span>
                              <span
                                className={`mt-0.5 block text-xs ${
                                  active ? "text-brand-accent" : "text-white/75"
                                }`}
                              >
                                {item.subtitle}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {showProductFeatures && (
                    <div>
                      <p className="mb-2 border-b-2 border-brand-secondary pb-1 text-xs font-semibold uppercase tracking-wide text-brand-accent">
                        {t("nav.productMenu.featuresLabel")}
                      </p>
                      <div className="space-y-1">
                        {featureItems.map((item) => {
                          const active = isActiveRoute(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              role="menuitem"
                              className={mobileItemClass(active)}
                              onClick={() => {
                                setMenuOpen(false);
                                setMobileProductoOpen(false);
                              }}
                            >
                              <span
                                className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                              >
                                {item.icon}
                              </span>
                              <span>
                                <span className="block text-sm font-semibold">{item.title}</span>
                                <span
                                  className={`mt-0.5 block text-xs ${
                                    active ? "text-brand-accent" : "text-white/75"
                                  }`}
                                >
                                  {item.subtitle}
                                </span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 rounded-lg bg-brand-neutral px-3 py-2">
                    <p className="text-xs text-brand-accent">
                      {t("nav.productMenu.footerQuestion")}
                    </p>
                    <Link
                      href="/contacto"
                      onClick={() => {
                        setMenuOpen(false);
                        setMobileProductoOpen(false);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary"
                    >
                      {t("nav.productMenu.footerCta")} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="my-2 border-t border-white/10" />

            <Link
              href="/precios"
              className="px-2 py-2 font-medium text-white/90 transition-colors hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {t("header.pricing")}
            </Link>

            <div className="my-2 border-t border-white/10" />

            <div className="py-2">
              <p className="mb-2 px-2 text-xs font-semibold uppercase text-brand-accent">
                {t("header.resources")}
              </p>
              {resourceItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-2 py-2 text-white/90 transition-colors hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="my-2 border-t border-white/10" />

            <Link
              href="/contacto"
              className="px-2 py-2 font-medium text-white/90 transition-colors hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {t("header.contact")}
            </Link>

            <div className="space-y-3 pt-4">
              <Link
                href="/contacto"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-full bg-brand-secondary px-6 py-3 text-center font-semibold text-white shadow-lg transition-colors hover:bg-brand-secondary/90"
              >
                {t("header.requestDemo")}
              </Link>

              <button
                onClick={handleLogin}
                className="block w-full rounded-full border border-white/20 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t("header.login")}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
    {forceSolid ? <div className="h-[88px]" aria-hidden="true" /> : null}
    </>
  );
}
