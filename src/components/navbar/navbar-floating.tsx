"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Menu, Search, X, Sun, Moon, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { SPRING_PANEL } from "@/lib/motion-ease";
import {
  DEFAULT_NAV_ITEMS,
  NAVBAR_BRAND_TITLE,
  NAVBAR_CTA_LABEL,
  NAVBAR_LOGO_SRC,
  NAVBAR_SIGN_IN_LABEL,
} from "./constants";
import { FloatingMegaMenuPanel } from "./floating-mega-menu-panel";
import { NavbarMobileDrawer } from "./navbar-mobile-drawer";
import { useNavbarMegaMenu } from "./use-navbar-mega-menu";
import type { NavItem } from "./types";
import { isMegaItem } from "./types";
import { BrandLogo } from "./brand-logo";
import { LanguageDropdown } from "./language-dropdown";
import { SearchCommandPalette } from "./search-command-palette";
import {
  getLanguage,
  getFlagUrl,
  type SupportedLocale,
} from "@/lib/i18n/languages";
import { getTranslation } from "@/lib/i18n/translations";

export type NavbarFloatingProps = {
  brandTitle?: string;
  logoSrc?: string;
  logoAlt?: string;
  items?: NavItem[];
  signInLabel?: string;
  ctaLabel?: string;
  onNavSelect?: (itemId: string, linkId?: string) => void;
  onSignIn?: () => void;
  onCta?: () => void;
  className?: string;
};

export function NavbarFloating({
  brandTitle = NAVBAR_BRAND_TITLE,
  logoSrc: _logoSrc = NAVBAR_LOGO_SRC,
  logoAlt = "GeoTrivia X",
  items = DEFAULT_NAV_ITEMS,
  signInLabel = NAVBAR_SIGN_IN_LABEL,
  ctaLabel = NAVBAR_CTA_LABEL,
  onNavSelect,
  onSignIn,
  onCta,
  className,
}: NavbarFloatingProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [_isEmbedded, _setIsEmbedded] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const inIframe = window.self !== window.top;
        const urlParams = new URLSearchParams(window.location.search);
        return inIframe || urlParams.get("embedded") === "true";
      } catch {
        return true;
      }
    }
    return false;
  });
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(() => {
    if (typeof window !== "undefined") {
      const docLang = (
        new URLSearchParams(window.location.search).get("lang") ||
        document.documentElement.lang ||
        localStorage.getItem("geotrivia_lang") ||
        "en"
      ).toLowerCase() as SupportedLocale;
      return docLang;
    }
    return "en";
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const desktopLangTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Global hotkeys to trigger search palette: Cmd+K / Ctrl+K / '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" &&
          !["INPUT", "TEXTAREA", "SELECT"].includes(
            (e.target as HTMLElement)?.tagName
          ))
      ) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    // Sync initial state if document loaded after render
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
      const docLang = (
        document.documentElement.lang ||
        localStorage.getItem("geotrivia_lang") ||
        "en"
      ).toLowerCase() as SupportedLocale;
      setCurrentLocale(docLang);
    }

    const handleLangUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: string }>;
      if (customEvent.detail?.lang) {
        setCurrentLocale(customEvent.detail.lang as SupportedLocale);
      }
    };
    window.addEventListener("geotrivia-lang-updated", handleLangUpdate);

    // Listen to theme update events (from postMessage or internal)
    const handleThemeUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      if (customEvent.detail?.theme) {
        setIsDark(customEvent.detail.theme === "dark");
      }
    };
    window.addEventListener("geotrivia-theme-updated", handleThemeUpdate);

    return () => {
      window.removeEventListener("geotrivia-lang-updated", handleLangUpdate);
      window.removeEventListener("geotrivia-theme-updated", handleThemeUpdate);
    };
  }, []);

  const handleSelectLanguage = (code: SupportedLocale) => {
    justClosedTimeRef.current = Date.now();
    setCurrentLocale(code);
    try {
      localStorage.setItem("geotrivia_lang", code);
      document.documentElement.lang = code;
      document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
      window.dispatchEvent(
        new CustomEvent("geotrivia-lang-updated", { detail: { lang: code } })
      );
      if (typeof window !== "undefined" && window.self !== window.top) {
        window.parent.postMessage(
          { type: "GEOTRIVIA_LANG_CHANGE", lang: code },
          "*"
        );
      }
    } catch {
      // Storage unavailable
    }
    setIsLanguageOpen(false);
  };

  const currentLang = getLanguage(currentLocale);
  const t = getTranslation(currentLocale);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Sync to parent app if embedded
    if (typeof window !== "undefined" && window.self !== window.top) {
      window.parent.postMessage(
        { type: "GEOTRIVIA_THEME_CHANGE", theme: nextDark ? "dark" : "light" },
        "*"
      );
    }
  };

  const {
    openMegaId,
    mobileOpen,
    mobileExpandedId,
    activeMega,
    scheduleMegaClose,
    scheduleMegaOpen,
    openMega,
    closeMega,
    setMobileOpen,
    setMobileExpandedId,
    handleMegaTriggerClick,
    handleLinkClick,
  } = useNavbarMegaMenu({ items, onNavSelect });

  const handleOpenMega = (id: string) => {
    setIsLanguageOpen(false);
    openMega(id);
  };

  const handleScheduleMegaOpen = (id: string) => {
    if (isLanguageOpen) return;
    scheduleMegaOpen(id);
  };

  const justClosedTimeRef = React.useRef(0);

  const handleCloseLanguage = () => {
    justClosedTimeRef.current = Date.now();
    setIsLanguageOpen(false);
  };

  const handleToggleLanguage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    // If closed by outside click in the last 250ms, don't re-open on click
    if (Date.now() - justClosedTimeRef.current < 250) {
      return;
    }
    closeMega();
    setIsLanguageOpen((prev) => !prev);
  };

  return (
    <nav
      data-component="navbar-top"
      className={cn("relative w-full transition-colors duration-200", className)}
      onMouseLeave={scheduleMegaClose}
    >
      <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Brand Column */}
        <div className="flex min-w-0 items-center justify-start">
          <a
            href="/"
            className="flex min-h-11 shrink-0 items-center rounded-xl px-1 transition-opacity hover:opacity-85"
            aria-label={brandTitle || logoAlt || NAVBAR_BRAND_TITLE}
          >
            <BrandLogo />
          </a>
        </div>

        {/* Navigation Column */}
        <div className="flex justify-center">
          <nav
            className="hidden items-center gap-0.5 xl:gap-1 rounded-full bg-surface/60 px-1 xl:px-1.5 py-1 lg:flex"
            aria-label="Primary"
          >
            {items.map((item) =>
              isMegaItem(item) ? (
                <button
                  key={item.id}
                  type="button"
                  aria-expanded={openMegaId === item.id}
                  aria-haspopup="true"
                  onMouseEnter={() => handleScheduleMegaOpen(item.id)}
                  onFocus={() => handleOpenMega(item.id)}
                  onClick={() => {
                    setIsLanguageOpen(false);
                    handleMegaTriggerClick(item);
                  }}
                  className={cn(
                    "flex h-8 min-h-8 items-center gap-1 rounded-full px-2.5 xl:px-3.5 text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer",
                    openMegaId === item.id
                      ? "bg-chart-metric-bg text-foreground shadow-xs"
                      : "text-chart-muted hover:text-foreground hover:bg-surface",
                  )}
                >
                  {item.id === "places-nature"
                    ? t.nav.placesNature
                    : item.id === "culture-history"
                      ? t.nav.cultureHistory
                      : item.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-chart-muted transition-transform duration-200",
                      openMegaId === item.id && "rotate-180",
                    )}
                    strokeWidth={2.5}
                  />
                </button>
              ) : (
                <a
                  key={item.id}
                  href={item.href || "#"}
                  onMouseEnter={closeMega}
                  onFocus={closeMega}
                  onClick={() => {
                    setIsLanguageOpen(false);
                    handleLinkClick(item.id);
                  }}
                  className="flex h-8 min-h-8 items-center rounded-full px-2.5 xl:px-3.5 text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 text-chart-muted transition-colors hover:text-foreground hover:bg-surface"
                >
                  {item.id === "home" ? t.nav.home : item.label}
                </a>
              ),
            )}

            {/* Language Selector Dropdown in Central Pill (Replaces 'All Articles') */}
            <div
              className="relative"
              onMouseEnter={closeMega}
            >
              <button
                ref={desktopLangTriggerRef}
                type="button"
                onMouseEnter={closeMega}
                onFocus={closeMega}
                onClick={handleToggleLanguage}
                className={cn(
                  "flex h-8 min-h-8 items-center gap-1.5 rounded-full pl-2 pr-2 xl:pr-2.5 text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer select-none",
                  isLanguageOpen
                    ? "bg-surface text-foreground shadow-2xs"
                    : "text-chart-muted hover:text-foreground hover:bg-surface"
                )}
                aria-label={t.nav.selectLanguage}
                aria-expanded={isLanguageOpen}
                aria-haspopup="true"
              >
                <img
                  src={getFlagUrl(currentLang.countryCode)}
                  alt={currentLang.name}
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] rounded-full object-cover shrink-0"
                />
                <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
                  {currentLang.nativeName}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3 text-chart-muted transition-transform duration-200",
                    isLanguageOpen && "rotate-180"
                  )}
                  strokeWidth={2.5}
                />
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <LanguageDropdown
                    isOpen={isLanguageOpen}
                    onClose={handleCloseLanguage}
                    currentLocale={currentLocale}
                    onSelectLanguage={handleSelectLanguage}
                    align="center"
                    triggerRef={desktopLangTriggerRef}
                  />
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* Actions Column */}
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5">
          {/* Search Button */}
          <button
            type="button"
            aria-label={t.nav.search}
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-surface text-chart-muted transition-colors hover:text-foreground sm:flex cursor-pointer"
            onClick={() => {
              setIsSearchOpen(true);
              onNavSelect?.("search");
            }}
          >
            <Search className="size-4" strokeWidth={2.5} />
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            aria-label={t.nav.theme}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-chart-muted transition-colors hover:text-foreground cursor-pointer"
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun className="size-4 text-amber-400" strokeWidth={2.5} />
            ) : (
              <Moon className="size-4" strokeWidth={2.5} />
            )}
          </button>

          {/* Primary CTA Button (Always visible to drive game conversion to main site) */}
          <a
            href="https://geotriviax.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.playGame || ctaLabel || "Play Game"}
            className="flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-[#3898ec] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-3 sm:px-4 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:shadow-md cursor-pointer select-none"
            onClick={onCta}
          >
            <Gamepad2 className="size-4 shrink-0" strokeWidth={2.2} />
            <span className="inline">{t.nav.playGame || ctaLabel || "Play Game"}</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface lg:hidden cursor-pointer"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-5" strokeWidth={2.5} />
            ) : (
              <Menu className="size-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Floating Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMega && !isLanguageOpen ? (
          <motion.div
            key={activeMega.id}
            initial={reduceMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={reduceMotion ? { duration: 0 } : SPRING_PANEL}
            className="absolute inset-x-0 top-full z-50 hidden pt-2 lg:block"
            onMouseEnter={() => openMega(activeMega.id)}
          >
            <FloatingMegaMenuPanel
              item={activeMega}
              onLinkClick={(linkId) => handleLinkClick(activeMega.id, linkId)}
              onFeaturedClick={() => handleLinkClick(activeMega.id, "featured")}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <NavbarMobileDrawer
        items={items}
        mobileOpen={mobileOpen}
        mobileExpandedId={mobileExpandedId}
        signInLabel={signInLabel}
        ctaLabel={ctaLabel}
        ctaClassName="bg-[#3898ec] text-white hover:bg-[#529bf5]"
        showSignIn={false}
        showCta={true}
        currentLocale={currentLocale}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectLanguage={handleSelectLanguage}
        onNavSelect={onNavSelect}
        onSignIn={onSignIn}
        onCta={onCta}
        onLinkClick={handleLinkClick}
        onMobileExpandedChange={setMobileExpandedId}
        onClose={() => setMobileOpen(false)}
      />

      {/* Global Search Command Palette */}
      <SearchCommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentLocale={currentLocale}
      />
    </nav>
  );
}

export default NavbarFloating;
