export type FBTerms = 'sponsored' | 'suggestions' | 'reels';

export interface I18n {
  [key: string]: string;
}

export type Translations = Record<FBTerms, I18n>

export const fbi18n: Translations = {
  sponsored: {
    fr: 'Sponsorisé',
    en: 'Sponsored',
  },
  suggestions: {
    fr: 'Suggestions',
    en: 'Suggested for you',
  },
  reels: {
    fr: 'Reels et vidéos courtes',
    en: 'Reels and short videos',
  },
};

export function i18n(term: FBTerms, lang: string): string {
  return fbi18n?.[term]?.[lang];
}
