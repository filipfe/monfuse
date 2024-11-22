export const LANGS: Lang[] = ["pl", "en"];

export const LOCALES: Locale[] = [
  // "al-AL", // Albania
  // "de-AT", // Austria
  // "nl-BE", // Belgium (Dutch)
  // "fr-BE", // Belgium (French)
  // "bs-BA", // Bosnia and Herzegovina (Bosnian)
  // "bg-BG", // Bulgaria
  // "hr-HR", // Croatia
  // "cs-CZ", // Czech Republic
  // "da-DK", // Denmark
  // "nl-NL", // Netherlands
  "en-GB", // United Kingdom
  "en-US", // United States
  // "et-EE", // Estonia
  // "fi-FI", // Finland
  // "fr-FR", // France
  // "de-DE", // Germany
  // "el-GR", // Greece
  // "hu-HU", // Hungary
  // "is-IS", // Iceland
  // "ga-IE", // Ireland (Irish)
  // "en-IE", // Ireland (English)
  // "it-IT", // Italy
  // "lv-LV", // Latvia
  // "lt-LT", // Lithuania
  // "lb-LU", // Luxembourg
  // "mt-MT", // Malta
  // "ro-RO", // Romania
  // "mk-MK", // North Macedonia
  // "no-NO", // Norway
  "pl-PL", // Poland
  // "pt-PT", // Portugal
  // "sr-RS", // Serbia
  // "sk-SK", // Slovakia
  // "sl-SI", // Slovenia
  // "es-ES", // Spain
  // "sv-SE", // Sweden
  // "tr-TR", // Turkey
  // "uk-UA", // Ukraine
  // "el-CY", // Cyprus (Greek)
  // "tr-CY", // Cyprus (Turkish)
] as const;

export const LOCALE_CURRENCIES: Record<Locale, string> = {
  // "al-AL": "ALL", // Albania - Albanian Lek
  // "de-AT": "EUR", // Austria - Euro
  // "nl-BE": "EUR", // Belgium - Euro
  // "fr-BE": "EUR", // Belgium - Euro
  // "bs-BA": "BAM", // Bosnia and Herzegovina - Convertible Mark
  // "bg-BG": "BGN", // Bulgaria - Bulgarian Lev
  // "hr-HR": "EUR", // Croatia - Euro (since 2023)
  // "cs-CZ": "CZK", // Czech Republic - Czech Koruna
  // "da-DK": "DKK", // Denmark - Danish Krone
  // "nl-NL": "EUR", // Netherlands - Euro
  "en-GB": "GBP", // United Kingdom - British Pound
  "en-US": "USD", // United States - Dollar
  // "et-EE": "EUR", // Estonia - Euro
  // "fi-FI": "EUR", // Finland - Euro
  // "fr-FR": "EUR", // France - Euro
  // "de-DE": "EUR", // Germany - Euro
  // "el-GR": "EUR", // Greece - Euro
  // "hu-HU": "HUF", // Hungary - Hungarian Forint
  // "is-IS": "ISK", // Iceland - Icelandic Króna
  // "ga-IE": "EUR", // Ireland - Euro
  // "en-IE": "EUR", // Ireland - Euro
  // "it-IT": "EUR", // Italy - Euro
  // "lv-LV": "EUR", // Latvia - Euro
  // "lt-LT": "EUR", // Lithuania - Euro
  // "lb-LU": "EUR", // Luxembourg - Euro
  // "mt-MT": "EUR", // Malta - Euro
  // "ro-RO": "RON", // Romania - Romanian Leu
  // "mk-MK": "MKD", // North Macedonia - Macedonian Denar
  // "no-NO": "NOK", // Norway - Norwegian Krone
  "pl-PL": "PLN", // Poland - Polish Złoty
  // "pt-PT": "EUR", // Portugal - Euro
  // "sr-RS": "RSD", // Serbia - Serbian Dinar
  // "sk-SK": "EUR", // Slovakia - Euro
  // "sl-SI": "EUR", // Slovenia - Euro
  // "es-ES": "EUR", // Spain - Euro
  // "sv-SE": "SEK", // Sweden - Swedish Krona
  // "tr-TR": "TRY", // Turkey - Turkish Lira
  // "uk-UA": "UAH", // Ukraine - Ukrainian Hryvnia
  // "el-CY": "EUR", // Cyprus - Euro
  // "tr-CY": "EUR", // Cyprus (Northern part, unofficial) - Euro
};
