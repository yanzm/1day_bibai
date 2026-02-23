export interface SpotSeason {
  available: boolean;
  notes: string;
}

export interface Spot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  url: string;
  mapUrl: string;
  hours: string;
  closed: string;
  fee: string;
  parking: boolean;
  themes: string[];
  seasons: Record<string, SpotSeason>;
  duration: string;
  photos: string[];
  description: string;
  trivia: string;
}

export interface Event {
  id: string;
  name: string;
  period: string;
  period_example: string;
  location: string;
  description: string;
  themes: string[];
  season: string;
  url: string;
}

export interface SpotsData {
  spots: Spot[];
  events: Event[];
}

export const THEME_IDS = [
  "unique_experience",
  "local_hidden",
  "sports_outdoor",
  "art_photo",
  "nature_relax",
  "food",
  "history_mining",
  "surprise",
] as const;

export const THEME_LABELS: Record<string, string> = {
  sports_outdoor: "アクティブ・外遊び",
  unique_experience: "ちょっと変わった体験",
  art_photo: "アート＆フォトさんぽ",
  nature_relax: "自然・のんびり",
  food: "美唄メシ巡り",
  history_mining: "炭鉱・開拓ロマン",
  local_hidden: "穴場コース",
  surprise: "完全おまかせ",
};

export const SEASON_IDS = ["spring", "summer", "autumn", "winter"] as const;

export const SEASON_LABELS: Record<string, string> = {
  spring: "春（4〜5月）",
  summer: "夏（6〜8月）",
  autumn: "秋（9〜11月）",
  winter: "冬（12〜3月）",
};

export function createEmptySpot(): Omit<Spot, "id"> {
  return {
    name: "",
    address: "",
    lat: 0,
    lng: 0,
    phone: "",
    url: "",
    mapUrl: "",
    hours: "",
    closed: "",
    fee: "",
    parking: true,
    themes: [],
    seasons: {
      spring: { available: true, notes: "" },
      summer: { available: true, notes: "" },
      autumn: { available: true, notes: "" },
      winter: { available: true, notes: "" },
    },
    duration: "",
    photos: [],
    description: "",
    trivia: "",
  };
}

export function createEmptyEvent(): Omit<Event, "id"> {
  return {
    name: "",
    period: "",
    period_example: "",
    location: "",
    description: "",
    themes: [],
    season: "spring",
    url: "",
  };
}