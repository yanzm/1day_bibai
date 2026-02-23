export interface ThemeOption {
  id: string;
  label: string;
  keyword: string;
}

export interface SeasonOption {
  id: string;
  label: string;
}

export const THEMES: ThemeOption[] = [
  { id: "unique_experience", label: "ちょっと変わった体験", keyword: "unique_experience" },
  { id: "local_hidden", label: "地元民だけが知ってる穴場コース", keyword: "local_hidden" },
  { id: "sports_outdoor", label: "アクティブ・外遊び", keyword: "sports_outdoor" },
  { id: "art_photo", label: "アート＆フォトさんぽ", keyword: "art_photo" },
  { id: "nature_relax", label: "自然・のんびり", keyword: "nature_relax" },
  { id: "food", label: "美唄メシ巡り", keyword: "food" },
  { id: "history_mining", label: "炭鉱・開拓ロマン", keyword: "history_mining" },
  { id: "surprise", label: "完全おまかせ", keyword: "surprise" },
];

export const SEASONS: SeasonOption[] = [
  { id: "now", label: "今の時期" },
  { id: "spring", label: "春（4〜5月）" },
  { id: "summer", label: "夏（6〜8月）" },
  { id: "autumn", label: "秋（9〜11月）" },
  { id: "winter", label: "冬（12〜3月）" },
];

export interface PlanFormData {
  themeId: string;
  seasonId: string;
}

export interface RoutePoint {
  name: string;
  description: string;
  time?: string;
  photos?: string[];
  lat: number;
  lng: number;
  mapUrl?: string;
  order: number;
}

export interface PlanContent {
  title: string;
  intro: string;
  closing: string;
  notes: string;
}

export interface TravelPlan {
  id: string;
  themeId: string;
  themeName: string;
  seasonId: string;
  seasonName: string;
  content?: string; // 旧形式（後方互換）
  plan?: PlanContent; // 新形式
  route: RoutePoint[];
  createdAt: string;
}
