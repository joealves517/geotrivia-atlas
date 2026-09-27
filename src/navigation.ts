import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Places & Nature',
      links: [
        { text: 'World Landmarks', href: getPermalink('world-landmarks', 'category') },
        { text: 'Castles & Palaces', href: getPermalink('castles-and-palaces', 'category') },
        { text: 'Cities & Capitals', href: getPermalink('cities-and-capitals', 'category') },
        { text: 'Natural Wonders', href: getPermalink('natural-wonders', 'category') },
        { text: 'Street View & Routes', href: getPermalink('street-view-and-discovery', 'category') },
        { text: 'Countries & Territories', href: getPermalink('countries-and-territories', 'category') },
      ],
    },
    {
      text: 'Culture & History',
      links: [
        { text: 'Flags & Symbols', href: getPermalink('flags-and-symbols', 'category') },
        { text: 'Culture & Arts', href: getPermalink('culture-and-arts', 'category') },
        { text: 'History & Civilization', href: getPermalink('history-and-civilization', 'category') },
      ],
    },
    {
      text: 'Open World',
      links: [
        { text: 'Rankings & Indices', href: getPermalink('rankings', 'category') },
        { text: 'Geographic Paradoxes', href: getPermalink('paradoxes', 'category') },
        { text: 'Earth Extremes', href: getPermalink('extremes', 'category') },
        { text: 'Borders & Frontiers', href: getPermalink('borders', 'category') },
        { text: 'Micronations', href: getPermalink('micronations', 'category') },
        { text: 'Ghost Towns & Ruins', href: getPermalink('abandoned', 'category') },
        { text: 'Earth Enigmas', href: getPermalink('enigmas', 'category') },
        { text: 'Indigenous Peoples', href: getPermalink('indigenous', 'category') },
      ],
    },
    {
      text: 'All Articles',
      href: getBlogPermalink(),
    },
  ],
  actions: [{ text: 'Play Game', href: 'https://geotriviax.com', target: '_blank' }],
};

export const footerData = {
  categoryLinks: [
    { text: 'World Landmarks', href: getPermalink('world-landmarks', 'category') },
    { text: 'Castles & Palaces', href: getPermalink('castles-and-palaces', 'category') },
    { text: 'Cities & Capitals', href: getPermalink('cities-and-capitals', 'category') },
    { text: 'Natural Wonders', href: getPermalink('natural-wonders', 'category') },
    { text: 'Street View & Routes', href: getPermalink('street-view-and-discovery', 'category') },
    { text: 'Countries & Territories', href: getPermalink('countries-and-territories', 'category') },
    { text: 'Flags & Symbols', href: getPermalink('flags-and-symbols', 'category') },
    { text: 'Culture & Arts', href: getPermalink('culture-and-arts', 'category') },
    { text: 'History & Civilization', href: getPermalink('history-and-civilization', 'category') },
    { text: 'Rankings & Indices', href: getPermalink('rankings', 'category') },
    { text: 'Geographic Paradoxes', href: getPermalink('paradoxes', 'category') },
    { text: 'Earth Extremes', href: getPermalink('extremes', 'category') },
    { text: 'Borders & Frontiers', href: getPermalink('borders', 'category') },
    { text: 'Micronations', href: getPermalink('micronations', 'category') },
    { text: 'Ghost Towns & Ruins', href: getPermalink('abandoned', 'category') },
    { text: 'Earth Enigmas', href: getPermalink('enigmas', 'category') },
    { text: 'Indigenous Peoples', href: getPermalink('indigenous', 'category') },
    { text: 'All Articles', href: getBlogPermalink() },
  ],
  socialLinks: [
    {
      ariaLabel: 'YouTube',
      title: 'YouTube (@geotriviax)',
      icon: 'tabler:brand-youtube',
      href: 'https://youtube.com/@geotriviax',
    },
    {
      ariaLabel: 'TikTok',
      title: 'TikTok (@geotrivia.x)',
      icon: 'tabler:brand-tiktok',
      href: 'https://www.tiktok.com/@geotrivia.x',
    },
    {
      ariaLabel: 'Instagram',
      title: 'Instagram (@geotriviax)',
      icon: 'tabler:brand-instagram',
      href: 'https://instagram.com/geotriviax',
    },
    {
      ariaLabel: 'Facebook',
      title: 'Facebook (@geotriviax)',
      icon: 'tabler:brand-facebook',
      href: 'https://www.facebook.com/profile.php?id=61590331627078',
    },
  ],
  footNote: `© ${new Date().getFullYear()} GeoTrivia X · Global Geography & Earth Culture Publication · All rights reserved.`,
};
