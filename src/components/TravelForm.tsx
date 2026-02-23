"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlanFormData, THEMES, SEASONS } from "@/types/plan";
import { cn } from "@/lib/utils";

const THEME_ICONS: Record<string, string> = {
  sports_outdoor: "🚴",
  unique_experience: "🎪",
  art_photo: "🎨",
  nature_relax: "🌿",
  food: "🍖",
  history_mining: "⛏️",
  local_hidden: "🗺️",
  surprise: "🎲",
};

const SEASON_ICONS: Record<string, string> = {
  now: "📅",
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

interface TravelFormProps {
  onSubmit: (data: PlanFormData) => void;
  isLoading: boolean;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [themeId, setThemeId] = useState("");
  const [seasonId, setSeasonId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeId || !seasonId) return;
    onSubmit({ themeId, seasonId });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg shadow-primary/5 border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">プランを作る</CardTitle>
        <CardDescription className="text-base">
          気分とシーズンを選んでください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label className="text-base font-semibold">どんな気分？</Label>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className={cn(
                    "group relative rounded-xl border-2 p-4 text-left transition-all",
                    "hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5",
                    themeId === theme.id
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border/60 bg-card"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img">
                      {THEME_ICONS[theme.id] ?? "📌"}
                    </span>
                    <span className="text-sm font-medium leading-tight">
                      {theme.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">いつ行く？</Label>
            <div className="flex flex-wrap gap-3">
              {SEASONS.map((season) => (
                <button
                  key={season.id}
                  type="button"
                  onClick={() => setSeasonId(season.id)}
                  className={cn(
                    "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                    "hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5",
                    seasonId === season.id
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border/60 bg-card"
                  )}
                >
                  <span className="mr-1.5">{SEASON_ICONS[season.id] ?? "📅"}</span>
                  {season.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-base h-12 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            size="lg"
            disabled={isLoading || !themeId || !seasonId}
          >
            プランを生成する
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
