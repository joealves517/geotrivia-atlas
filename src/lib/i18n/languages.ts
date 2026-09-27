export type SupportedLocale = "en" | "de" | "es" | "fr" | "it" | "nl" | "pt" | "sv" | "tr" | "ar";

export interface LanguageConfig {
  code: SupportedLocale;
  countryCode: string;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  greeting: string;
}

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: "en",
    countryCode: "us",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    greeting: "Hello!",
  },
  {
    code: "de",
    countryCode: "de",
    name: "German",
    nativeName: "Deutsch",
    dir: "ltr",
    greeting: "Hallo!",
  },
  {
    code: "es",
    countryCode: "es",
    name: "Spanish",
    nativeName: "Español",
    dir: "ltr",
    greeting: "¡Hola!",
  },
  {
    code: "fr",
    countryCode: "fr",
    name: "French",
    nativeName: "Français",
    dir: "ltr",
    greeting: "Bonjour !",
  },
  {
    code: "it",
    countryCode: "it",
    name: "Italian",
    nativeName: "Italiano",
    dir: "ltr",
    greeting: "Ciao!",
  },
  {
    code: "nl",
    countryCode: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    dir: "ltr",
    greeting: "Hallo!",
  },
  {
    code: "pt",
    countryCode: "br",
    name: "Portuguese",
    nativeName: "Português",
    dir: "ltr",
    greeting: "Olá!",
  },
  {
    code: "sv",
    countryCode: "se",
    name: "Swedish",
    nativeName: "Svenska",
    dir: "ltr",
    greeting: "Hej!",
  },
  {
    code: "tr",
    countryCode: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    dir: "ltr",
    greeting: "Merhaba!",
  },
  {
    code: "ar",
    countryCode: "sa",
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    greeting: "مرحباً!",
  },
];

export function getLanguage(code: string | null | undefined): LanguageConfig {
  const cleanCode = (code || "").toLowerCase().trim();
  return (
    SUPPORTED_LANGUAGES.find((lang) => lang.code === cleanCode) ||
    SUPPORTED_LANGUAGES[0]
  );
}

export function isRtlLocale(code: string | null | undefined): boolean {
  return getLanguage(code).dir === "rtl";
}

export function getFlagUrl(countryCode: string): string {
  return `/flags-round/${countryCode.toLowerCase()}.webp`;
}
