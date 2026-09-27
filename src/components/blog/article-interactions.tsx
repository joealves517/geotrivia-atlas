"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Heart,
  MessageSquare,
  Send,
  LogIn,
  Share2,
  Check,
  CornerDownRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getTranslation } from "@/lib/i18n/translations";
import type { SupportedLocale } from "@/lib/i18n/languages";

export interface ArticleComment {
  id: string;
  articleSlug: string;
  userId: string;
  parentId?: string | null;
  username: string;
  avatarUrl: string | null;
  isVip: boolean;
  content: string;
  createdAt: string;
}

export interface UserAuthProfile {
  userId: string;
  username: string;
  avatarUrl: string | null;
  isVip: boolean;
  token?: string;
}

interface ArticleInteractionsProps {
  slug: string;
  currentLocale?: string;
}

const getApiBase = (): string => {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:8080";
  }
  return "https://api.geotriviax.com";
};

const getAppOrigin = (): string => {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5173";
  }
  return "https://geotriviax.com";
};

const getFallbackAvatar = (username?: string | null): string => {
  const seed = (username || "Guest").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundType=solid&backgroundColor=b6e3f4&scale=120`;
};

const getCrossDomainCookieAuth = (): UserAuthProfile | null => {
  if (typeof document === "undefined") return null;
  try {
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const trimmed = c.trim();
      if (trimmed.startsWith("geotrivia_auth=")) {
        const value = trimmed.slice("geotrivia_auth=".length);
        const parsed = JSON.parse(decodeURIComponent(value));
        if (parsed && parsed.userId) {
          return {
            userId: parsed.userId,
            username: parsed.username || "Explorer",
            avatarUrl: parsed.avatarUrl || null,
            isVip: Boolean(parsed.isVip),
            token: parsed.token || undefined,
          };
        }
      }
    }
  } catch (err) {
    console.warn("[ArticleInteractions] Failed to parse auth cookie:", err);
  }
  return null;
};

const resolveAvatarUrl = (url?: string | null, username?: string | null): string => {
  if (!url || typeof url !== "string") {
    return getFallbackAvatar(username);
  }
  const trimmed = url.trim();
  // Rive and Lottie animations cannot be displayed in standard <img> tags
  if (
    trimmed.endsWith(".lottie") ||
    trimmed.endsWith(".riv") ||
    trimmed.includes(".lottie") ||
    trimmed.includes(".riv") ||
    trimmed.includes("/lottie/") ||
    trimmed.includes("/animations/") ||
    trimmed.includes("/images/avatars/")
  ) {
    return getFallbackAvatar(username);
  }
  // If relative path, prepend appOrigin so it loads from the parent app host
  if (trimmed.startsWith("/")) {
    return `${getAppOrigin()}${trimmed}`;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return getFallbackAvatar(username);
};

const formatRelativeTime = (
  dateStr: string,
  locale: string = "en",
  justNowText: string = "just now"
): string => {
  try {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diffInSeconds = Math.round((then - now) / 1000);
    const absDiff = Math.abs(diffInSeconds);

    if (absDiff < 45) {
      return justNowText;
    }

    if (typeof Intl !== "undefined" && Intl.RelativeTimeFormat) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
      if (absDiff < 3600) {
        return rtf.format(Math.round(diffInSeconds / 60), "minute");
      }
      if (absDiff < 86400) {
        return rtf.format(Math.round(diffInSeconds / 3600), "hour");
      }
      if (absDiff < 2592000) {
        return rtf.format(Math.round(diffInSeconds / 86400), "day");
      }
    }

    return new Date(dateStr).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const getInitialLocale = (fallback?: string): SupportedLocale => {
  if (typeof window !== "undefined") {
    try {
      const urlLang = new URLSearchParams(window.location.search).get("lang")?.toLowerCase()?.trim();
      if (urlLang && ["en", "de", "es", "fr", "it", "nl", "pt", "sv", "tr", "ar"].includes(urlLang)) {
        return urlLang as SupportedLocale;
      }
      const stored = localStorage.getItem("geotrivia_lang")?.toLowerCase()?.trim();
      if (stored && ["en", "de", "es", "fr", "it", "nl", "pt", "sv", "tr", "ar"].includes(stored)) {
        return stored as SupportedLocale;
      }
      const docLang = document.documentElement.lang?.toLowerCase()?.trim();
      if (docLang && ["en", "de", "es", "fr", "it", "nl", "pt", "sv", "tr", "ar"].includes(docLang)) {
        return docLang as SupportedLocale;
      }
    } catch {
      // Ignore
    }
  }
  const cleanFallback = fallback?.toLowerCase()?.trim();
  if (cleanFallback && ["en", "de", "es", "fr", "it", "nl", "pt", "sv", "tr", "ar"].includes(cleanFallback)) {
    return cleanFallback as SupportedLocale;
  }
  return "en";
};

export function ArticleInteractions({
  slug,
  currentLocale = "en",
}: ArticleInteractionsProps) {
  const [locale, setLocale] = useState<SupportedLocale>(() =>
    getInitialLocale(currentLocale)
  );
  const [currentUser, setCurrentUser] = useState<UserAuthProfile | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const t = getTranslation(locale);
  const isRtl = locale === "ar";
  const apiBase = getApiBase();
  const appOrigin = getAppOrigin();

  // Group comments into top-level and nested replies
  const topLevelComments = useMemo(() => {
    return [...comments.filter((c) => !c.parentId)].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments]);

  const repliesByParentId = useMemo(() => {
    const map = new Map<string, ArticleComment[]>();
    for (const c of comments) {
      if (c.parentId) {
        const list = map.get(c.parentId) || [];
        list.push(c);
        map.set(c.parentId, list);
      }
    }
    for (const [, list] of map.entries()) {
      list.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    return map;
  }, [comments]);

  // Listen for language sync
  useEffect(() => {
    if (currentLocale) setLocale(currentLocale as SupportedLocale);
  }, [currentLocale]);

  useEffect(() => {
    const handleLangUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang?: SupportedLocale; locale?: SupportedLocale }>;
      const next = customEvent.detail?.lang || customEvent.detail?.locale;
      if (next && ["en", "de", "es", "fr", "it", "nl", "pt", "sv", "tr", "ar"].includes(next)) {
        setLocale(next as SupportedLocale);
      }
    };
    window.addEventListener("geotrivia-lang-updated", handleLangUpdate);
    return () => window.removeEventListener("geotrivia-lang-updated", handleLangUpdate);
  }, []);

  // Listen for Auth Sync from parent window (GeoTrivia Client)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "GEOTRIVIA_AUTH_SYNC") {
        const user = event.data.user;
        if (user && user.userId) {
          setCurrentUser(user);
          try {
            localStorage.setItem("geotrivia_auth_user", JSON.stringify(user));
          } catch {
            // Storage quota
          }
        } else {
          setCurrentUser(null);
          try {
            localStorage.removeItem("geotrivia_auth_user");
          } catch {
            // Storage quota
          }
        }
      } else if (event.data?.type === "GEOTRIVIA_LANG_CHANGE") {
        const nextLang = event.data.locale || event.data.lang;
        if (nextLang && ["en", "de", "es", "fr", "it", "nl", "pt", "sv", "tr", "ar"].includes(nextLang)) {
          setLocale(nextLang as SupportedLocale);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Request fresh auth state from parent on mount, or read cross-domain cookie
    try {
      if (typeof window !== "undefined" && window.self !== window.top) {
        window.parent.postMessage({ type: "GEOTRIVIA_REQUEST_AUTH" }, "*");
      } else {
        // First priority: Read root cross-domain cookie (.geotriviax.com)
        const cookieUser = getCrossDomainCookieAuth();
        if (cookieUser) {
          setCurrentUser(cookieUser);
        } else {
          // Fallback to local storage
          const cached = localStorage.getItem("geotrivia_auth_user");
          if (cached) {
            setCurrentUser(JSON.parse(cached));
          }
        }
      }
    } catch {
      // Fallback
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Fetch interactions data
  const fetchInteractions = useCallback(async () => {
    if (!slug) return;
    try {
      const url = new URL(`${apiBase}/api/atlas/articles/${slug}/interactions`);
      if (currentUser?.userId) {
        url.searchParams.set("userId", currentUser.userId);
      }
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setLikesCount(json.data.likesCount || 0);
          setHasLiked(Boolean(json.data.hasLiked));
          setComments(json.data.comments || []);
        }
      }
    } catch (err) {
      console.error("[ArticleInteractions] Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, currentUser?.userId, apiBase]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  // Request login from parent app or redirect
  const handleRequestLogin = () => {
    if (typeof window !== "undefined" && window.self !== window.top) {
      window.parent.postMessage(
        {
          type: "GEOTRIVIA_REQUEST_LOGIN",
          returnUrl: window.location.pathname,
        },
        "*"
      );
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `${appOrigin}/login?redirect=${returnUrl}`;
    }
  };

  // Open public profile without needing authentication
  const handleOpenProfile = (e: React.MouseEvent, targetUserId: string) => {
    const profileUrl = `/profile/${targetUserId}`;

    if (typeof window !== "undefined" && window.self !== window.top) {
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage(
        {
          type: "GEOTRIVIA_NAVIGATE",
          url: profileUrl,
        },
        "*"
      );
    }
    // Outside iframe: allow standard <a> tag click to navigate or open in new tab
  };

  // Like Toggle
  const handleToggleLike = async () => {
    if (!currentUser?.userId) {
      handleRequestLogin();
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    const prevHasLiked = hasLiked;
    const prevLikesCount = likesCount;
    setHasLiked(!prevHasLiked);
    setLikesCount(prevHasLiked ? Math.max(0, prevLikesCount - 1) : prevLikesCount + 1);

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (currentUser.token) {
      headers["Authorization"] = `Bearer ${currentUser.token}`;
    }

    try {
      const res = await fetch(`${apiBase}/api/atlas/articles/${slug}/like`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId: currentUser.userId }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setHasLiked(json.data.liked);
          setLikesCount(json.data.likesCount);
        }
      } else {
        // Rollback on server error
        setHasLiked(prevHasLiked);
        setLikesCount(prevLikesCount);
      }
    } catch (err) {
      console.error("[ArticleInteractions] Failed to toggle like:", err);
      setHasLiked(prevHasLiked);
      setLikesCount(prevLikesCount);
    } finally {
      setIsLiking(false);
    }
  };

  // Submit Comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.userId) {
      handleRequestLogin();
      return;
    }

    const trimmed = newComment.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (currentUser.token) {
      headers["Authorization"] = `Bearer ${currentUser.token}`;
    }

    try {
      const res = await fetch(`${apiBase}/api/atlas/articles/${slug}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: currentUser.userId,
          username: currentUser.username,
          avatarUrl: currentUser.avatarUrl,
          isVip: currentUser.isVip,
          content: trimmed,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setComments((prev) => [json.data, ...prev]);
          setNewComment("");
        }
      }
    } catch (err) {
      console.error("[ArticleInteractions] Failed to submit comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reply Handlers
  const handleOpenReply = (commentId: string, replyToUsername?: string) => {
    if (!currentUser?.userId) {
      handleRequestLogin();
      return;
    }
    if (replyingToId === commentId) {
      setReplyingToId(null);
      setReplyContent("");
    } else {
      setReplyingToId(commentId);
      setReplyContent(replyToUsername ? `@${replyToUsername} ` : "");
    }
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyContent("");
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!currentUser?.userId) {
      handleRequestLogin();
      return;
    }

    const trimmed = replyContent.trim();
    if (!trimmed || isSubmittingReply) return;

    setIsSubmittingReply(true);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (currentUser.token) {
      headers["Authorization"] = `Bearer ${currentUser.token}`;
    }

    try {
      const res = await fetch(`${apiBase}/api/atlas/articles/${slug}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: currentUser.userId,
          username: currentUser.username,
          avatarUrl: currentUser.avatarUrl,
          isVip: currentUser.isVip,
          content: trimmed,
          parentId,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setComments((prev) => [...prev, json.data]);
          setReplyingToId(null);
          setReplyContent("");
        }
      }
    } catch (err) {
      console.error("[ArticleInteractions] Failed to submit reply:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Share Article Link
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        // User cancelled or unsupported
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="mt-8 text-neutral-900 dark:text-neutral-100 max-w-3xl mx-auto px-4 sm:px-6"
    >
      {/* 1. Action Toolbar: Like, Comment Count, and Share */}
      <div className="flex items-center justify-between gap-4 pb-3.5 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none border-0"
            title={hasLiked ? t.interactions.liked : t.interactions.like}
          >
            <Heart
              className={`size-4.5 transition-transform group-hover:scale-110 ${
                hasLiked ? "fill-rose-500 text-rose-500" : "text-neutral-500 dark:text-neutral-400"
              }`}
            />
            <span className={hasLiked ? "text-neutral-900 dark:text-neutral-100 font-bold" : ""}>
              {likesCount}
            </span>
            <span className="hidden sm:inline text-xs opacity-75">
              {likesCount === 1 ? t.interactions.like : t.interactions.likes}
            </span>
          </button>

          {/* Comments Count Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 select-none">
            <MessageSquare className="size-4.5" />
            <span>{comments.length}</span>
            <span className="hidden sm:inline text-xs opacity-75">{t.interactions.comments}</span>
          </div>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none border-0"
        >
          {copiedLink ? (
            <>
              <Check className="size-4 text-lime-600" />
              <span className="text-lime-600 font-semibold">{t.interactions.copied}</span>
            </>
          ) : (
            <>
              <Share2 className="size-4" />
              <span className="hidden sm:inline">{t.interactions.share}</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Comment Box Area */}
      <div className="my-4">
        {currentUser ? (
          /* Authenticated User Comment Form (Simplified: Just the clean frame) */
          <form onSubmit={handleSubmitComment} className="space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t.interactions.commentPlaceholder}
              rows={3}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-2xl border-0 border-none bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:outline-none focus:ring-0 resize-none transition-all shadow-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-mono">
                {newComment.length} / 1000
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#a3d018] text-neutral-900 hover:bg-[#b5e61d] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none border-0 shadow-xs active:scale-98"
              >
                <Send className="size-3.5" />
                <span>{isSubmitting ? t.interactions.posting : t.interactions.postComment}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Unauthenticated Call to Action */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-0 border-none">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 text-center sm:text-left">
              {t.interactions.loginToInteract}
            </p>
            <button
              type="button"
              onClick={handleRequestLogin}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3898ec] text-white hover:bg-[#529bf5] transition-colors cursor-pointer shrink-0 shadow-sm outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none border-0"
            >
              <LogIn className="size-4" />
              <span>{t.interactions.signIn}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Comments Stream */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          {t.interactions.comments} ({comments.length})
        </h3>

        {topLevelComments.length === 0 && !isLoading && (
          <div className="py-4 text-center text-sm text-neutral-400">
            {t.interactions.noCommentsYet}
          </div>
        )}

        <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
          {topLevelComments.map((comment) => {
            const replies = repliesByParentId.get(comment.id) || [];
            const isReplying = replyingToId === comment.id;

            return (
              <div key={comment.id} className="py-3.5 group">
                <div className="flex items-start gap-3">
                  {/* Clickable Avatar */}
                  <a
                    href={`${appOrigin}/profile/${comment.userId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleOpenProfile(e, comment.userId)}
                    className="relative size-10 shrink-0 block hover:opacity-90 transition-opacity"
                    title={`${t.interactions.viewProfile}: ${comment.username}`}
                  >
                    <img
                      src={resolveAvatarUrl(comment.avatarUrl, comment.username)}
                      alt={comment.username}
                      className="size-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
                      loading="lazy"
                      onError={(e) => {
                        const fallback = getFallbackAvatar(comment.username);
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />
                  </a>

                  {/* Comment Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`${appOrigin}/profile/${comment.userId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleOpenProfile(e, comment.userId)}
                        className="hover:underline transition-all"
                      >
                        <span
                          className={
                            comment.isVip
                              ? "!text-transparent dark:!text-transparent !bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] font-black bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 dark:from-amber-300 dark:via-orange-400 dark:to-yellow-300 select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] text-sm"
                              : "text-sm font-bold text-slate-800 dark:text-neutral-200"
                          }
                        >
                          {comment.username}
                        </span>
                      </a>

                      <span className="text-[11px] text-neutral-400">
                        {formatRelativeTime(comment.createdAt, locale, t.interactions.justNow)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>

                    {/* Comment Actions: Reply Button */}
                    <div className="mt-2 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleOpenReply(comment.id, comment.username)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-sky-500 dark:text-neutral-400 dark:hover:text-sky-400 transition-colors cursor-pointer select-none"
                      >
                        <CornerDownRight className="size-3.5" />
                        <span>{t.interactions.reply}</span>
                      </button>
                    </div>

                    {/* Inline Reply Input Box */}
                    {isReplying && (
                      <form
                        onSubmit={(e) => handleSubmitReply(e, comment.id)}
                        className="mt-3 p-3 rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/80 border-0 border-none space-y-2 animate-in fade-in duration-150"
                      >
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={t.interactions.replyPlaceholder || "Write a reply..."}
                          rows={2}
                          maxLength={1000}
                          autoFocus
                          className="w-full px-3 py-2.5 rounded-xl border-0 border-none bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:outline-none focus:ring-0 resize-none transition-all shadow-none"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {replyContent.length} / 1000
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleCancelReply}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer select-none"
                            >
                              {t.interactions.cancel}
                            </button>
                            <button
                              type="submit"
                              disabled={!replyContent.trim() || isSubmittingReply}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#3898ec] text-white hover:bg-[#529bf5] disabled:opacity-50 transition-colors cursor-pointer select-none shadow-xs"
                            >
                              <Send className="size-3" />
                              <span>{isSubmittingReply ? t.interactions.posting : t.interactions.reply}</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Threaded Nested Replies */}
                    {replies.length > 0 && (
                      <div className="mt-3.5 space-y-3 pl-3 sm:pl-4 border-l-2 border-neutral-200/80 dark:border-neutral-800">
                        {replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2.5">
                            <a
                              href={`${appOrigin}/profile/${reply.userId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleOpenProfile(e, reply.userId)}
                              className="size-7 sm:size-8 shrink-0 block hover:opacity-90 transition-opacity"
                              title={`${t.interactions.viewProfile}: ${reply.username}`}
                            >
                              <img
                                src={resolveAvatarUrl(reply.avatarUrl, reply.username)}
                                alt={reply.username}
                                className="size-7 sm:size-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
                                loading="lazy"
                                onError={(e) => {
                                  const fallback = getFallbackAvatar(reply.username);
                                  if (e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  }
                                }}
                              />
                            </a>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <a
                                  href={`${appOrigin}/profile/${reply.userId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => handleOpenProfile(e, reply.userId)}
                                  className="hover:underline transition-all"
                                >
                                  <span
                                    className={
                                      reply.isVip
                                        ? "!text-transparent dark:!text-transparent !bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] font-black bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 dark:from-amber-300 dark:via-orange-400 dark:to-yellow-300 select-none text-xs"
                                        : "text-xs font-bold text-slate-800 dark:text-neutral-200"
                                    }
                                  >
                                    {reply.username}
                                  </span>
                                </a>
                                <span className="text-[10px] text-neutral-400">
                                  {formatRelativeTime(reply.createdAt, locale, t.interactions.justNow)}
                                </span>
                              </div>

                              <p className="mt-1 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
                                {reply.content}
                              </p>

                              <button
                                type="button"
                                onClick={() => handleOpenReply(comment.id, reply.username)}
                                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-sky-500 dark:text-neutral-400 dark:hover:text-sky-400 transition-colors cursor-pointer select-none"
                              >
                                <CornerDownRight className="size-3" />
                                <span>{t.interactions.reply}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ArticleInteractions;
