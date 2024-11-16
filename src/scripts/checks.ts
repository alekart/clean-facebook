import { Settings } from './interfaces/settings.interface';

export const checks: Record<string, Record<string, string[]>> = {
  en: {
    sponsored: ['Sponsored'],
    suggestions: [
      '· Follow(?!ing)',
      '· Join',
    ],
    videos: ['^Reels and short videos'],
    sideSponsored: ['^Sponsored'],
  },
  fr: {
    sponsored: ['Sponsorisé'],
    suggestions: [
      '· Suivre',
    ],
    videos: ['Reels et vidéos courtes'],
    sideSponsored: ['^Sponsorisé'],
  },
};

export function getChecks(language: string, settings: Settings): RegExp[] {
  const c = checks[language];
  const strings: string[] = [];
  Object.keys(settings).forEach((key) => {
    if (c[key]) {
      strings.push(...c[key]);
    }
  });
  return strings.map((s) => new RegExp(s));
}
