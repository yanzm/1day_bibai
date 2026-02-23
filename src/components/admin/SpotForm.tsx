"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Spot,
  THEME_IDS,
  THEME_LABELS,
  SEASON_IDS,
  SEASON_LABELS,
  createEmptySpot,
} from "@/types/spot";
import { cn } from "@/lib/utils";

function PhotoUrlEditor({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const url = inputRef.current?.value.trim();
    if (!url) return;
    onChange([...photos, url]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <Label>写真URL</Label>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="https://..."
          onKeyDown={handleKeyDown}
          className="text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          追加
        </Button>
      </div>
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {photos.map((url, i) => (
            <div
              key={i}
              className="relative group rounded-lg overflow-hidden border border-border/60"
            >
              <img
                src={url}
                alt=""
                className="h-16 w-24 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).alt = "読込エラー";
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SpotFormProps {
  spot?: Spot;
  onSave: (spot: Spot | Omit<Spot, "id">) => void;
  onCancel: () => void;
}

export function SpotForm({ spot, onSave, onCancel }: SpotFormProps) {
  const isEditing = !!spot;
  const [form, setForm] = useState<Spot | Omit<Spot, "id">>(
    spot ?? createEmptySpot()
  );

  const updateField = <K extends keyof Spot>(key: K, value: Spot[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTheme = (themeId: string) => {
    const themes = form.themes.includes(themeId)
      ? form.themes.filter((t) => t !== themeId)
      : [...form.themes, themeId];
    updateField("themes", themes);
  };

  const updateSeason = (
    seasonId: string,
    field: "available" | "notes",
    value: boolean | string
  ) => {
    const seasons = {
      ...form.seasons,
      [seasonId]: { ...form.seasons[seasonId], [field]: value },
    };
    updateField("seasons", seasons);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? `${spot.name} を編集` : "新しいスポットを追加"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">スポット名 *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lat">緯度 (lat)</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => updateField("lat", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">経度 (lng)</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => updateField("lng", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => updateField("url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapUrl">Google Maps URL</Label>
              <Input
                id="mapUrl"
                value={form.mapUrl}
                onChange={(e) => updateField("mapUrl", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">営業時間</Label>
              <Input
                id="hours"
                value={form.hours}
                onChange={(e) => updateField("hours", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closed">定休日</Label>
              <Input
                id="closed"
                value={form.closed}
                onChange={(e) => updateField("closed", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee">料金</Label>
              <Input
                id="fee"
                value={form.fee}
                onChange={(e) => updateField("fee", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">所要時間の目安</Label>
              <Input
                id="duration"
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="例: 30〜60分"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="parking"
                checked={form.parking}
                onChange={(e) => updateField("parking", e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="parking">駐車場あり</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明 *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trivia">豆知識・裏話</Label>
            <Textarea
              id="trivia"
              value={form.trivia}
              onChange={(e) => updateField("trivia", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>テーマ（複数選択可）</Label>
            <div className="flex flex-wrap gap-2">
              {THEME_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleTheme(id)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors",
                    form.themes.includes(id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {THEME_LABELS[id]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>季節ごとの情報</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SEASON_IDS.map((seasonId) => (
                <div
                  key={seasonId}
                  className="rounded-lg border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {SEASON_LABELS[seasonId]}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`season-${seasonId}`}
                        checked={form.seasons[seasonId]?.available ?? true}
                        onChange={(e) =>
                          updateSeason(seasonId, "available", e.target.checked)
                        }
                        className="h-4 w-4"
                      />
                      <Label
                        htmlFor={`season-${seasonId}`}
                        className="text-xs"
                      >
                        利用可
                      </Label>
                    </div>
                  </div>
                  <Input
                    placeholder="この季節のポイント"
                    value={form.seasons[seasonId]?.notes ?? ""}
                    onChange={(e) =>
                      updateSeason(seasonId, "notes", e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <PhotoUrlEditor
            photos={form.photos}
            onChange={(photos) => updateField("photos", photos)}
          />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit">
              {isEditing ? "更新" : "追加"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
