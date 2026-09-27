"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { SPRING_PANEL, SPRING_PRESS } from "@/lib/motion-ease";
import type { NavMegaItem } from "./types";

type FloatingMegaMenuPanelProps = {
  item: NavMegaItem;
  onLinkClick?: (linkId: string) => void;
  onFeaturedClick?: () => void;
};

export function FloatingMegaMenuPanel({
  item,
  onLinkClick,
  onFeaturedClick,
}: FloatingMegaMenuPanelProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
      transition={reduceMotion ? { duration: 0 } : SPRING_PANEL}
      className="overflow-hidden rounded-2xl border border-border bg-chart-metric-bg p-4 shadow-lg sm:p-5 backdrop-blur-md"
    >
      <div
        className={cn(
          "grid gap-6",
          item.featured
            ? "lg:grid-cols-[minmax(0,1fr)_240px]"
            : "lg:grid-cols-1",
        )}
      >
        <div
          className={cn(
            "grid gap-6",
            item.columns.length >= 3
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "sm:grid-cols-2",
          )}
        >
          {item.columns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { ...SPRING_PRESS, delay: 0.04 + columnIndex * 0.05 }
              }
              className="flex min-w-0 flex-col gap-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-chart-muted">
                {column.title}
              </p>
              <ul className="flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href || "#"}
                      onClick={() => onLinkClick?.(link.id)}
                      className="group flex w-full min-h-11 items-start gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-surface"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {link.label}
                          </span>
                          {link.badge ? (
                            <span className="rounded-full bg-[#c0f21e] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#1f3a08]">
                              {link.badge}
                            </span>
                          ) : null}
                        </span>
                        {link.description ? (
                          <span className="mt-0.5 block text-xs text-chart-muted">
                            {link.description}
                          </span>
                        ) : null}
                      </span>
                      <ArrowRight
                        className="mt-0.5 size-3.5 shrink-0 text-chart-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        strokeWidth={2.5}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {item.featured ? (
          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { ...SPRING_PRESS, delay: 0.12 }
            }
            className="flex min-w-0 flex-col justify-between gap-4 rounded-2xl bg-chart-bg p-4"
          >
            <div className="flex flex-col gap-2">
              <span
                className="size-2.5 rounded-full bg-[#a3d018] dark:bg-[#c0f21e]"
                aria-hidden
              />
              <h3 className="text-sm font-semibold text-foreground">
                {item.featured.title}
              </h3>
              <p className="text-sm text-chart-muted">
                {item.featured.description}
              </p>
            </div>
            <a
              href={item.featured.href || "https://geotriviax.com"}
              onClick={onFeaturedClick}
              className="flex h-11 min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3898ec] text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-xs"
            >
              {item.featured.ctaLabel}
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </a>
          </motion.aside>
        ) : null}
      </div>
    </motion.div>
  );
}
