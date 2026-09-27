"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  X,
  ArrowRight,
  CornerDownLeft,
  Loader2,
  TrendingUp,
  Clock,
  BookOpen,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { SearchIndexItem } from "~/pages/search.json";
import { getTranslation } from "@/lib/i18n/translations";
import type { SupportedLocale } from "@/lib/i18n/languages";

interface SearchCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale?: string;
}

const normalizeStr = (str: string): string =>
  (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export function SearchCommandPalette({
  isOpen,
  onClose,
  currentLocale = "en",
}: SearchCommandPaletteProps) {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<SupportedLocale>(
    (currentLocale as SupportedLocale) || "en"
  );
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchIndexItem[]>([]);
  const [isLoadingIndex, setIsLoadingIndex] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Sync locale prop
  useEffect(() => {
    if (currentLocale) {
      setLocale(currentLocale as SupportedLocale);
    }
  }, [currentLocale]);

  // Listen to external language updates
  useEffect(() => {
    const handleLangUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: SupportedLocale }>;
      if (customEvent.detail?.lang) {
        setLocale(customEvent.detail.lang);
      }
    };
    window.addEventListener("geotrivia-lang-updated", handleLangUpdate);
    return () => {
      window.removeEventListener("geotrivia-lang-updated", handleLangUpdate);
    };
  }, []);

  const t = getTranslation(locale);

  // SSR hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch index on first mount or open
  useEffect(() => {
    if (!isOpen) return;

    if (items.length === 0) {
      setIsLoadingIndex(true);
      fetch("/search.json")
        .then((res) => res.json())
        .then((data: SearchIndexItem[]) => {
          setItems(data);
          setIsLoadingIndex(false);
        })
        .catch((err) => {
          console.error("[Atlas Search] Failed to load /search.json", err);
          setIsLoadingIndex(false);
        });
    }

    setSelectedIndex(0);

    // Prevent body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus input on open
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 60);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, items.length]);

  // Global escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Dynamic real tags computed from actual articles (0 mock data)
  // Sorted by frequency (highest number of articles), secondary by newest date
  const dynamicTrendingTags = useMemo(() => {
    const tagMap = new Map<string, { count: number; latestDate: number }>();

    items.forEach((item) => {
      const itemDate = item.publishDate ? new Date(item.publishDate).getTime() : 0;
      (item.tags || []).forEach((rawTag) => {
        const tag = rawTag?.trim();
        if (!tag) return;
        const existing = tagMap.get(tag);
        if (existing) {
          existing.count += 1;
          if (itemDate > existing.latestDate) {
            existing.latestDate = itemDate;
          }
        } else {
          tagMap.set(tag, { count: 1, latestDate: itemDate });
        }
      });
    });

    return Array.from(tagMap.entries())
      .sort((a, b) => {
        if (b[1].count !== a[1].count) {
          return b[1].count - a[1].count;
        }
        return b[1].latestDate - a[1].latestDate;
      })
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [items]);

  // Dynamic real categories computed from actual articles (0 mock data)
  // Sorted by frequency (highest number of articles) descending
  const dynamicCategories = useMemo(() => {
    const catMap = new Map<string, number>();
    items.forEach((item) => {
      const cat = item.category?.trim();
      if (cat) {
        catMap.set(cat, (catMap.get(cat) || 0) + 1);
      }
    });

    return Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([category]) => category);
  }, [items]);

  // Multi-token diacritic-insensitive filter
  const filteredItems = useMemo(() => {
    const rawTrimmed = query.trim();
    if (!rawTrimmed) return [];

    const norm = normalizeStr(rawTrimmed);
    const words = norm.split(/\s+/).filter(Boolean);

    return items.filter((item) => {
      const itemTitle = normalizeStr(item.title);
      const itemExcerpt = normalizeStr(item.excerpt);
      const itemCat = normalizeStr(item.category);
      const itemTags = (item.tags || []).map(normalizeStr).join(" ");
      const combined = `${itemTitle} ${itemExcerpt} ${itemCat} ${itemTags}`;

      return words.every((word) => combined.includes(word));
    });
  }, [items, query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation inside the list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? filteredItems.length - 1 : prev - 1
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems.length > 0 && filteredItems[selectedIndex]) {
        const item = filteredItems[selectedIndex];
        window.location.href = item.permalink;
      }
    }
  };

  if (!mounted) return null;

  const isRtl = locale === "ar";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 overflow-y-auto">
          {/* Dimmed Backdrop (No Blur) */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <motion.div
            key="search-dialog"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            dir={isRtl ? "rtl" : "ltr"}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#18181b] z-10 my-auto sm:my-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Search Input Field (Sleek 48px Header with Subtle Bottom Line) */}
            <div className="flex h-12 items-center px-4 border-b border-neutral-200/60 bg-neutral-50/40 dark:border-neutral-800/60 dark:bg-neutral-900/40">
              <Search className="size-4.5 shrink-0 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.search.placeholder}
                className="mx-3 flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="mx-2 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  aria-label="Clear query"
                >
                  <X className="size-4" />
                </button>
              ) : null}
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md bg-neutral-200/60 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                ESC
              </kbd>
            </div>

            {/* Body Section */}
            <div
              ref={listRef}
              className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-1"
            >
              {/* Loading Index Indicator */}
              {isLoadingIndex && (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-400">
                  <Loader2 className="size-4 animate-spin text-[#a3d018]" />
                  <span>{t.search.loading}</span>
                </div>
              )}

              {/* Empty Query State: Real Trending Tags & Real Categories */}
              {!query.trim() && !isLoadingIndex && (
                <div className="space-y-4 py-2">
                  {/* Real Trending Tags (No Numbers) */}
                  {dynamicTrendingTags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        <TrendingUp className="size-3.5 text-lime-600 dark:text-lime-400" />
                        <span>{t.search.trendingTags}</span>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2 px-2">
                        {dynamicTrendingTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setQuery(tag);
                              inputRef.current?.focus();
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
                          >
                            <span className="text-lime-600 dark:text-lime-400 font-semibold">#</span>
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Real Categories Filter Chips (No Numbers) */}
                  {dynamicCategories.length > 0 && (
                    <div className="px-2 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        <Tag className="size-3.5 text-lime-600 dark:text-lime-400" />
                        <span>{t.search.categories}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {dynamicCategories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setQuery(cat);
                              inputRef.current?.focus();
                            }}
                            className="rounded-full bg-neutral-100/70 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:bg-neutral-700 cursor-pointer"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Matching Results List */}
              {query.trim() && filteredItems.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    {filteredItems.length} {t.search.matchingDispatches}
                  </div>
                  {filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <a
                        key={item.slug}
                        href={item.permalink}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                          isSelected
                            ? "bg-neutral-100 dark:bg-neutral-800"
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                        }`}
                      >
                        {/* Image Thumbnail */}
                        <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="size-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-neutral-400">
                              <BookOpen className="size-5" />
                            </div>
                          )}
                        </div>

                        {/* Content Summary */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-lime-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-lime-800 dark:text-lime-300">
                              {item.category}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                              <Clock className="size-3" />
                              {item.readingTime} {t.post.minRead}
                            </span>
                          </div>
                          <h4 className="mt-1 truncate text-sm font-semibold text-neutral-900 group-hover:text-lime-600 dark:text-neutral-100 dark:group-hover:text-lime-400">
                            {item.title}
                          </h4>
                          <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {item.excerpt}
                          </p>
                        </div>

                        <ArrowRight className={`mt-2 size-4 shrink-0 text-neutral-400 opacity-0 transition-all group-hover:opacity-100 ${isRtl ? "group-hover:-translate-x-0.5 rotate-180" : "group-hover:translate-x-0.5"}`} />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Zero Matching Articles */}
              {query.trim() && filteredItems.length === 0 && !isLoadingIndex && (
                <div className="py-8 text-center space-y-2">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t.search.noResults} "{query}"
                  </p>
                  <p className="text-xs text-neutral-400">
                    {t.search.noResultsHint}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Bar with Hotkey Hints (Subtle Top Line) */}
            <div className="flex items-center justify-between border-t border-neutral-200/60 bg-neutral-50/70 px-4 py-2.5 text-[11px] text-neutral-500 dark:border-neutral-800/60 dark:bg-neutral-900/50 dark:text-neutral-400">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded bg-neutral-200/60 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    ↑
                  </kbd>
                  <kbd className="rounded bg-neutral-200/60 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    ↓
                  </kbd>
                  {t.search.navigate}
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded bg-neutral-200/60 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    <CornerDownLeft className="size-2.5 inline" />
                  </kbd>
                  {t.search.select}
                </span>
              </div>

              <span className="text-[10px] text-neutral-400">
                {t.search.knowledgeBase}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default SearchCommandPalette;
