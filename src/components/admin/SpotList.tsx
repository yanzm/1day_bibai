"use client";

import { useState } from "react";
import { Spot, THEME_IDS, THEME_LABELS } from "@/types/spot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SpotListProps {
  spots: Spot[];
  onEdit: (spot: Spot) => void;
  onDelete: (id: string) => void;
}

export function SpotList({ spots, onEdit, onDelete }: SpotListProps) {
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());

  const handleDelete = (spot: Spot) => {
    if (confirm(`「${spot.name}」を削除しますか？`)) {
      onDelete(spot.id);
    }
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) => {
      const next = new Set(prev);
      if (next.has(theme)) {
        next.delete(theme);
      } else {
        next.add(theme);
      }
      return next;
    });
  };

  const filteredSpots =
    selectedThemes.size === 0
      ? spots
      : spots.filter((spot) =>
          spot.themes.some((t) => selectedThemes.has(t))
        );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {THEME_IDS.map((theme) => (
          <button
            key={theme}
            onClick={() => toggleTheme(theme)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              selectedThemes.has(theme)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30"
            }`}
          >
            {THEME_LABELS[theme]}
          </button>
        ))}
        {selectedThemes.size > 0 && (
          <button
            onClick={() => setSelectedThemes(new Set())}
            className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            クリア
          </button>
        )}
      </div>
      {selectedThemes.size > 0 && (
        <p className="text-sm text-muted-foreground">
          {filteredSpots.length} / {spots.length} 件表示
        </p>
      )}
      {filteredSpots.map((spot) => (
        <Card key={spot.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{spot.name}</CardTitle>
                <CardDescription className="text-xs">
                  {spot.address}
                  {spot.hours && ` | ${spot.hours}`}
                </CardDescription>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(spot)}
                >
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(spot)}
                >
                  削除
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {spot.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {spot.themes.map((theme) => (
                <Badge key={theme} variant="secondary" className="text-xs">
                  {THEME_LABELS[theme] ?? theme}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
