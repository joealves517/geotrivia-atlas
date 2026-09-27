import type { NavItem } from "./types";
import { BRAND_LOGO_SRC, PRODUCT_NAME } from "@/lib/brand";

export const NAVBAR_BRAND_TITLE = PRODUCT_NAME;
export const NAVBAR_LOGO_SRC = BRAND_LOGO_SRC;
export const NAVBAR_SIGN_IN_LABEL = "All Articles";
export const NAVBAR_CTA_LABEL = "Play Game";

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: "places-nature",
    label: "Places & Nature",
    type: "mega",
    featured: {
      title: "Featured: Neuschwanstein Castle",
      description:
        "Bavaria's fairytale Alpine fortress soaring 65 meters above the Pöllat Gorge.",
      ctaLabel: "Read Story",
      href: "/neuschwanstein-castle",
    },
    columns: [
      {
        id: "architecture-monuments",
        title: "Architecture & Cities",
        links: [
          {
            id: "world-landmarks",
            label: "World Landmarks",
            description: "Ancient ruins, temples, monuments & iconic structures",
            badge: "Popular",
            href: "/atlas/world-landmarks",
          },
          {
            id: "castles-palaces",
            label: "Castles & Palaces",
            description: "Medieval citadels, royal estates & fortresses",
            href: "/atlas/castles-and-palaces",
          },
          {
            id: "cities-capitals",
            label: "Cities & Capitals",
            description: "Historic capitals and world metropolises",
            href: "/atlas/cities-and-capitals",
          },
        ],
      },
      {
        id: "earth-routes",
        title: "Wild Earth & Routes",
        links: [
          {
            id: "natural-wonders",
            label: "Natural Wonders",
            description: "Canyons, waterfalls, peaks & geological anomalies",
            badge: "Featured",
            href: "/atlas/natural-wonders",
          },
          {
            id: "street-view-discovery",
            label: "Street View & Routes",
            description: "Scenic highways, mountain passes & 360° panoramas",
            badge: "360°",
            href: "/atlas/street-view-and-discovery",
          },
          {
            id: "countries-territories",
            label: "Countries & Territories",
            description: "Geography, sovereign states and global regions",
            href: "/atlas/countries-and-territories",
          },
        ],
      },
    ],
  },
  {
    id: "culture-history",
    label: "Culture & History",
    type: "mega",
    featured: {
      title: "Featured: The Roman Empire",
      description:
        "From the Colosseum to the frontiers of antiquity, explore history's greatest milestones.",
      ctaLabel: "Read Story",
      href: "/roman-empire",
    },
    columns: [
      {
        id: "flags-arts",
        title: "Flags, Symbols & Arts",
        links: [
          {
            id: "flags-symbols",
            label: "Flags & Symbols",
            description: "National vexillology, heraldry and state seals",
            badge: "Popular",
            href: "/atlas/flags-and-symbols",
          },
          {
            id: "culture-arts",
            label: "Culture & Arts",
            description: "Heritage, traditional arts, cuisine & festivals",
            href: "/atlas/culture-and-arts",
          },
        ],
      },
      {
        id: "civilizations-catalog",
        title: "History & Archives",
        links: [
          {
            id: "history-civilization",
            label: "History & Civilization",
            description: "Ancient empires, milestones and historical epochs",
            badge: "Heritage",
            href: "/atlas/history-and-civilization",
          },
          {
            id: "all-catalog",
            label: "All Knowledge Catalog",
            description: "Browse the full curated world atlas collection",
            href: "/atlas",
          },
        ],
      },
    ],
  },
  {
    id: "open-world",
    label: "Open World",
    type: "mega",
    featured: {
      title: "Featured: Oceanic Inaccessibility",
      description:
        "Point Nemo, enclave anomalies, and mysterious corners across the globe.",
      ctaLabel: "Explore Open World",
      href: "/atlas/paradoxes",
    },
    columns: [
      {
        id: "anomalies-borders",
        title: "Anomalies & Borders",
        links: [
          {
            id: "rankings",
            label: "Rankings & Indices",
            description: "Global livability, oldest cities & sovereign metrics",
            badge: "New",
            href: "/atlas/rankings",
          },
          {
            id: "paradoxes",
            label: "Geographic Paradoxes",
            description: "Enclaves, exclaves, timezone anomalies & border quirks",
            badge: "Popular",
            href: "/atlas/paradoxes",
          },
          {
            id: "borders",
            label: "Borders & Frontiers",
            description: "Terra nullius, condominium treaties & divided cities",
            href: "/atlas/borders",
          },
          {
            id: "micronations",
            label: "Micronations",
            description: "Self-proclaimed states, micronational entities & sea forts",
            href: "/atlas/micronations",
          },
        ],
      },
      {
        id: "extremes-enigmas",
        title: "Extremes & Enigmas",
        links: [
          {
            id: "extremes",
            label: "Earth Extremes",
            description: "Point Nemo, deepest trenches & highest peaks",
            badge: "Extreme",
            href: "/atlas/extremes",
          },
          {
            id: "abandoned",
            label: "Ghost Towns & Ruins",
            description: "Pripyat, Hashima, abandoned mines & modern ruins",
            href: "/atlas/abandoned",
          },
          {
            id: "enigmas",
            label: "Earth Enigmas",
            description: "Door to Hell, Eye of the Sahara & sailing stones",
            href: "/atlas/enigmas",
          },
          {
            id: "indigenous",
            label: "Indigenous Peoples",
            description: "Bajau sea nomads, Sentinelese & isolated cultures",
            href: "/atlas/indigenous",
          },
        ],
      },
    ],
  },
];
