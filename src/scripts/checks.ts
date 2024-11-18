import { Settings } from './interfaces/settings.interface';

export const checks: Record<string, Record<string, RegExp[]>> = {
  en: {
    sponsored: [/Sponsored/],
    suggestions: [
      /· Follow(?!ing)/,
      /· Join/,
    ],
    videos: [/^Reels and short videos/],
    sideSponsored: [/^Sponsored/],
  },
  fr: {
    sponsored: [/Sponsorisé/],
    suggestions: [
      /·\sSuivre./,
      /·\sRejoindre./,
    ],
    videos: [/Reels et vidéos courtes/],
    sideSponsored: [/^Sponsorisé'/],
  },
};

export function getChecks(language: string, settings: Settings): RegExp[] {
  const c = checks[language];
  const regex: RegExp[] = [];
  Object.keys(settings).forEach((key) => {
    if (c[key]) {
      regex.push(...c[key]);
    }
  });
  return regex;
}
