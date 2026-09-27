"use client";

import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { SPRING_PANEL } from "@/lib/motion-ease";
import {
  SUPPORTED_LANGUAGES,
  getLanguage,
  getFlagUrl,
  type SupportedLocale,
} from "@/lib/i18n/languages";
import { getTranslation } from "@/lib/i18n/translations";

export interface LanguageDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale: SupportedLocale;
  onSelectLanguage: (code: SupportedLocale) => void;
  align?: "center" | "right" | "left";
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function LanguageDropdown({
  isOpen,
  onClose,
  currentLocale,
  onSelectLanguage,
  align = "center",
  className,
  triggerRef,
}: LanguageDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const t = getTranslation(currentLocale);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!triggerRef?.current || !triggerRef.current.contains(target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // Alignment classes relative to trigger
  const alignmentClass =
    align === "right"
      ? "right-0 origin-top-right"
      : align === "left"
        ? "left-0 origin-top-left"
        : "left-1/2 -translate-x-1/2 origin-top";

  return (
    <div
      ref={dropdownRef}
      className={cn("absolute top-[calc(100%+8px)] z-[100]", alignmentClass)}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
        transition={reduceMotion ? { duration: 0 } : SPRING_PANEL}
        className={cn(
          "w-[230px] sm:w-[240px] max-w-[calc(100vw-24px)]",
          "overflow-hidden rounded-2xl border border-border bg-chart-metric-bg p-2 shadow-lg select-none backdrop-blur-md",
          "max-h-[min(480px,calc(100vh-100px))] overflow-y-auto",
          className
        )}
        dir={getLanguage(currentLocale).dir}
        role="menu"
        aria-orientation="vertical"
      >
        {/* Header */}
        <div className="px-2.5 pt-1.5 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-chart-muted">
            {t.languageModal.title}
          </span>
        </div>

        {/* 1 Column Vertical List of 10 languages */}
        <div className="flex flex-col gap-0.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLocale === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={cn(
                  "group flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer text-left rtl:text-right outline-none w-full",
                  isSelected
                    ? "bg-surface text-foreground font-semibold"
                    : "text-foreground hover:bg-surface/80"
                )}
                role="menuitem"
                aria-checked={isSelected}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                  <img
                    src={getFlagUrl(lang.countryCode)}
                    alt={lang.name}
                    width={22}
                    height={22}
                    className="w-[22px] h-[22px] rounded-full object-cover shrink-0 shadow-xs"
                    loading="lazy"
                  />
                  <div className="flex flex-col min-w-0">
                    <span
                      className={cn(
                        "text-xs sm:text-[13px] leading-tight truncate",
                        isSelected
                          ? "font-bold text-foreground"
                          : "font-medium text-foreground"
                      )}
                    >
                      {lang.nativeName}
                    </span>
                    <span className="text-[10px] text-chart-muted truncate leading-tight">
                      {lang.name}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-foreground shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default LanguageDropdown;
