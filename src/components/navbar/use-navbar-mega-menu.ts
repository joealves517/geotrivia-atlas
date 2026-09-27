"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem, NavMegaItem } from "./types";
import { isMegaItem } from "./types";

const HOVER_OPEN_MS = 80;
const HOVER_CLOSE_MS = 280;

type UseNavbarMegaMenuOptions = {
  items: NavItem[];
  onNavSelect?: (itemId: string, linkId?: string) => void;
};

export function useNavbarMegaMenu({
  items,
  onNavSelect,
}: UseNavbarMegaMenuOptions) {
  const [openMegaId, setOpenMegaId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastOpenTimestampRef = useRef<number>(0);

  const activeMega = items.find(
    (item): item is NavMegaItem => isMegaItem(item) && item.id === openMegaId,
  );

  const clearHoverTimers = useCallback(() => {
    if (hoverOpenTimer.current) {
      clearTimeout(hoverOpenTimer.current);
      hoverOpenTimer.current = null;
    }
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  }, []);

  const openMega = useCallback(
    (id: string) => {
      clearHoverTimers();
      lastOpenTimestampRef.current = Date.now();
      setOpenMegaId(id);
    },
    [clearHoverTimers],
  );

  const scheduleMegaOpen = useCallback(
    (id: string) => {
      clearHoverTimers();
      hoverOpenTimer.current = setTimeout(() => openMega(id), HOVER_OPEN_MS);
    },
    [clearHoverTimers, openMega],
  );

  const scheduleMegaClose = useCallback(() => {
    clearHoverTimers();
    hoverCloseTimer.current = setTimeout(
      () => setOpenMegaId(null),
      HOVER_CLOSE_MS,
    );
  }, [clearHoverTimers]);

  const closeMega = useCallback(() => {
    clearHoverTimers();
    setOpenMegaId(null);
  }, [clearHoverTimers]);

  useEffect(() => {
    return () => clearHoverTimers();
  }, [clearHoverTimers]);

  useEffect(() => {
    if (!openMegaId) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMega();
      }
    }

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-component="navbar-top"]')) {
        return;
      }
      closeMega();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [closeMega, openMegaId]);

  useEffect(() => {
    if (!mobileOpen) return;

    // Prevent background scroll bleed when mobile drawer is open without touching
    // document body or html overflow, which destroys CSS position:sticky on the header
    function handleTouchMove(e: TouchEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-mobile-scroll="true"]')) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    }

    function handleWheel(e: WheelEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-mobile-scroll="true"]')) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    }

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  function handleMegaTriggerClick(item: NavMegaItem) {
    const timeSinceOpen = Date.now() - lastOpenTimestampRef.current;
    // If the menu was just opened by hover in the last 450ms, clicking keeps it pinned open
    if (openMegaId === item.id && timeSinceOpen < 450) {
      return;
    }
    if (openMegaId === item.id) {
      closeMega();
      return;
    }
    openMega(item.id);
  }

  function handleLinkClick(itemId: string, linkId?: string) {
    onNavSelect?.(itemId, linkId);
    closeMega();
    setMobileOpen(false);
  }

  return {
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
  };
}
