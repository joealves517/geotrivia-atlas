"use client";

import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { SPRING_PANEL } from "@/lib/motion-ease";
import type { NavItem } from "./types";
import { isMegaItem } from "./types";
import {
  SUPPORTED_LANGUAGES,
  getLanguage,
  getFlagUrl,
  type SupportedLocale,
} from "@/lib/i18n/languages";
import { getTranslation } from "@/lib/i18n/translations";

type NavbarMobileDrawerProps = {
  items: NavItem[];
  mobileOpen: boolean;
  mobileExpandedId: string | null;
  signInLabel: string;
  ctaLabel: string;
  ctaClassName: string;
  showSignIn?: boolean;
  showCta?: boolean;
  trailing?: ReactNode;
  currentLocale?: SupportedLocale;
  onOpenSearch?: () => void;
  onSelectLanguage?: (code: SupportedLocale) => void;
  onNavSelect?: (itemId: string, linkId?: string) => void;
  onSignIn?: () => void;
  onCta?: () => void;
  onLinkClick: (itemId: string, linkId?: string) => void;
  onMobileExpandedChange: (id: string | null) => void;
  onClose?: () => void;
};

export function NavbarMobileDrawer({
  items,
  mobileOpen,
  mobileExpandedId,
  signInLabel,
  ctaLabel,
  ctaClassName,
  showSignIn = true,
  showCta = true,
  trailing,
  currentLocale = "en",
  onOpenSearch,
  onSelectLanguage,
  onNavSelect,
  onSignIn,
  onCta,
  onLinkClick,
  onMobileExpandedChange,
  onClose,
}: NavbarMobileDrawerProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const languageAccordionRef = useRef<HTMLDivElement | null>(null);
  const currentLang = getLanguage(currentLocale);
  const t = getTranslation(currentLocale);

  useEffect(() => {
    if (isLanguageExpanded && languageAccordionRef.current) {
      const timer = setTimeout(() => {
        const drawerScroll = languageAccordionRef.current?.closest<HTMLElement>('[data-mobile-scroll="true"]');
        if (drawerScroll && languageAccordionRef.current) {
          const accordionTop = languageAccordionRef.current.offsetTop;
          drawerScroll.scrollTo({
            top: Math.max(0, accordionTop - 12),
            behavior: "smooth",
          });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isLanguageExpanded]);

  return (
    <AnimatePresence>
      {mobileOpen ? (
        <>
          {/* Backdrop overlay - clicking closes the menu */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-2xs lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Fixed overlay drawer - zero document reflow, completely stops article jumping */}
          <motion.div
            key="mobile-nav"
            data-mobile-scroll="true"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            }
            className="fixed inset-x-0 top-16 z-50 lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain touch-pan-y bg-white/95 dark:bg-[#1a1a1c]/95 backdrop-blur-xl border-b border-border shadow-2xl"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col gap-1 py-3 pb-8">
                {items.map((item) =>
                  isMegaItem(item) ? (
                    <div key={item.id} className="flex flex-col">
                  <button
                    type="button"
                    aria-expanded={mobileExpandedId === item.id}
                    className="flex h-11 min-h-11 items-center justify-between rounded-xl px-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                    onClick={() =>
                      onMobileExpandedChange(
                        mobileExpandedId === item.id ? null : item.id,
                      )
                    }
                  >
                    {item.id === "places-nature"
                      ? t.nav.placesNature
                      : item.id === "culture-history"
                        ? t.nav.cultureHistory
                        : item.id === "home"
                          ? t.nav.home
                          : item.label}
                    <ChevronDown
                      className={cn(
                        "size-4 text-chart-muted transition-transform",
                        mobileExpandedId === item.id && "rotate-180",
                      )}
                      strokeWidth={2.5}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileExpandedId === item.id ? (
                      <motion.div
                        initial={
                          reduceMotion ? false : { opacity: 0, height: 0 }
                        }
                        animate={{ opacity: 1, height: "auto" }}
                        exit={
                          reduceMotion ? undefined : { opacity: 0, height: 0 }
                        }
                        transition={
                          reduceMotion ? { duration: 0 } : SPRING_PANEL
                        }
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-4 px-2 pb-3 pt-1">
                          {item.columns.map((column) => (
                            <div
                              key={column.id}
                              className="flex flex-col gap-2"
                            >
                              <p className="text-xs font-semibold uppercase tracking-wide text-chart-muted">
                                {column.title}
                              </p>
                              <ul className="flex flex-col gap-1">
                                {column.links.map((link) => (
                                  <li key={link.id}>
                                    <a
                                      href={link.href || "#"}
                                      onClick={() =>
                                        onLinkClick(item.id, link.id)
                                      }
                                      className="flex min-h-11 w-full flex-col items-start rounded-xl px-2 py-2 text-left transition-colors hover:bg-surface"
                                    >
                                      <span className="text-sm font-medium text-foreground">
                                        {link.label}
                                      </span>
                                      {link.description ? (
                                        <span className="text-xs text-chart-muted">
                                          {link.description}
                                        </span>
                                      ) : null}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}

                          {item.featured ? (
                            <a
                              href={item.featured.href || "https://geotriviax.com"}
                              onClick={() => onLinkClick(item.id, "featured")}
                              className="flex min-h-11 flex-col gap-1 rounded-2xl bg-chart-bg px-3 py-3 text-left"
                            >
                              <span className="text-sm font-semibold text-foreground">
                                {item.featured.title}
                              </span>
                              <span className="text-xs text-chart-muted">
                                {item.featured.description}
                              </span>
                            </a>
                          ) : null}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={item.id}
                  href={item.href || "#"}
                  onClick={() => onLinkClick(item.id)}
                  className="flex h-11 min-h-11 items-center rounded-xl px-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                >
                  {item.id === "home" ? t.nav.home : item.label}
                </a>
              ),
            )}

            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {/* Expandable Language Accordion */}
              <div
                ref={languageAccordionRef}
                className="flex flex-col rounded-xl bg-surface/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setIsLanguageExpanded((prev) => !prev)}
                  className="flex h-11 min-h-11 items-center justify-between px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface cursor-pointer select-none"
                  aria-expanded={isLanguageExpanded}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getFlagUrl(currentLang.countryCode)}
                      alt={currentLang.name}
                      width={22}
                      height={22}
                      className="w-[22px] h-[22px] rounded-full object-cover shrink-0"
                    />
                    <span className="font-semibold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                      {currentLang.nativeName} ({currentLang.name})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      {t.nav.selectLanguage}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 text-chart-muted transition-transform duration-200",
                        isLanguageExpanded && "rotate-180"
                      )}
                      strokeWidth={2.5}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isLanguageExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                      className="overflow-hidden px-2 py-2 bg-background/50 rounded-b-xl"
                    >
                      <div
                        data-mobile-scroll="true"
                        className="flex flex-col gap-1 max-h-[280px] overflow-y-auto overscroll-contain touch-pan-y pr-1"
                      >
                        {SUPPORTED_LANGUAGES.map((lang) => {
                          const isSelected = currentLocale === lang.code;
                          return (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => {
                                onSelectLanguage?.(lang.code);
                                setIsLanguageExpanded(false);
                              }}
                              className={cn(
                                "flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer text-left rtl:text-right border-0 outline-none w-full",
                                isSelected
                                  ? "bg-neutral-200/70 dark:bg-white/[0.09]"
                                  : "hover:bg-surface"
                              )}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-1 rtl:pr-0 rtl:pl-1">
                                <img
                                  src={getFlagUrl(lang.countryCode)}
                                  alt={lang.name}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 rounded-full object-cover shrink-0 shadow-xs"
                                />
                                <div className="flex flex-col min-w-0">
                                  <span
                                    className={cn(
                                      "text-xs font-semibold truncate",
                                      isSelected
                                        ? "text-neutral-900 dark:text-white"
                                        : "text-neutral-800 dark:text-neutral-200"
                                    )}
                                  >
                                    {lang.nativeName}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
                                    {lang.name}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0 stroke-[2.5]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="button"
                className="flex h-11 min-h-11 w-full items-center gap-2 rounded-xl px-2 text-sm text-chart-muted transition-colors hover:bg-surface hover:text-foreground cursor-pointer"
                onClick={() => {
                  onOpenSearch?.();
                  onNavSelect?.("search");
                }}
              >
                <Search className="size-4" strokeWidth={2.5} />
                {t.nav.search}
              </button>
              {showSignIn ? (
                <a
                  href="/atlas"
                  className="flex h-11 min-h-11 items-center rounded-xl px-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                  onClick={onSignIn}
                >
                  {signInLabel}
                </a>
              ) : null}
              {showCta ? (
                <a
                  href="https://geotriviax.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-11 min-h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors shadow-xs",
                    ctaClassName,
                  )}
                  onClick={onCta}
                >
                  {ctaLabel}
                </a>
              ) : null}
              {trailing ? (
                <div className="flex items-center px-2 pt-1">{trailing}</div>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  ) : null}
</AnimatePresence>
  );
}
