"use client";

import { useState } from "react";
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
  Event,
  THEME_IDS,
  THEME_LABELS,
  SEASON_IDS,
  SEASON_LABELS,
  createEmptyEvent,
} from "@/types/spot";
import { cn } from "@/lib/utils";

interface EventFormProps {
  event?: Event;
  onSave: (event: Event | Omit<Event, "id">) => void;
  onCancel: () => void;
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const isEditing = !!event;
  const [form, setForm] = useState<Event | Omit<Event, "id">>(
    event ?? createEmptyEvent()
  );

  const updateField = <K extends keyof Event>(key: K, value: Event[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTheme = (themeId: string) => {
    const themes = form.themes.includes(themeId)
      ? form.themes.filter((t) => t !== themeId)
      : [...form.themes, themeId];
    updateField("themes", themes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? `${event.name} を編集` : "新しいイベントを追加"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">イベント名 *</Label>
              <Input
                id="event-name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-period">開催時期 *</Label>
              <Input
                id="event-period"
                value={form.period}
                onChange={(e) => updateField("period", e.target.value)}
                placeholder="例: 8月第1土曜・日曜"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-period-example">開催日の例</Label>
              <Input
                id="event-period-example"
                value={form.period_example}
                onChange={(e) => updateField("period_example", e.target.value)}
                placeholder="例: 2025年は8/2〜8/3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-location">場所</Label>
              <Input
                id="event-location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-url">URL</Label>
              <Input
                id="event-url"
                value={form.url}
                onChange={(e) => updateField("url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-season">季節 *</Label>
              <div className="flex gap-2">
                {SEASON_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateField("season", id)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm transition-colors",
                      form.season === id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {SEASON_LABELS[id]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">説明 *</Label>
            <Textarea
              id="event-description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              required
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
