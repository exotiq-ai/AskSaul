export type Season = "spring" | "summer" | "fall" | "winter";

export interface MenuTheme {
  season: Season;
  theme: string;
  last_updated: string;
}

const THEMES: Record<Season, string> = {
  spring: "garden-fresh produce from our on-site beds and local farms",
  summer: "peak-season produce, stone fruit, and live-fire cooking",
  fall: "Colorado grains, squash, and fermentation",
  winter: "preservation, fermentation, and slow-cooked Colorado grains",
};

function monthToSeason(m: number): Season {
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "fall";
  return "winter";
}

export function getCurrentMenuTheme(now: Date = new Date()): MenuTheme {
  const season = monthToSeason(now.getUTCMonth());
  return {
    season,
    theme: THEMES[season],
    last_updated: now.toISOString().slice(0, 10),
  };
}
