export type NavMegaLink = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  badge?: string;
};

export type NavMegaColumn = {
  id: string;
  title: string;
  links: NavMegaLink[];
};

export type NavMegaFeatured = {
  title: string;
  description: string;
  ctaLabel: string;
  href?: string;
};

export type NavMegaItem = {
  id: string;
  label: string;
  type: "mega";
  columns: NavMegaColumn[];
  featured?: NavMegaFeatured;
};

export type NavLinkItem = {
  id: string;
  label: string;
  type: "link";
  href?: string;
};

export type NavItem = NavMegaItem | NavLinkItem;

export function isMegaItem(item: NavItem): item is NavMegaItem {
  return item.type === "mega";
}
