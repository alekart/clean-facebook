export const languages = ['fr', 'en'];
export const fbi18n = {
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
  }
};

export function i18n(term, lang) {
  return fbi18n?.[term]?.[lang];
}