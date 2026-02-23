"use client";

import { Event, THEME_LABELS, SEASON_LABELS } from "@/types/spot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export function EventList({ events, onEdit, onDelete }: EventListProps) {
  const handleDelete = (event: Event) => {
    if (confirm(`「${event.name}」を削除しますか？`)) {
      onDelete(event.id);
    }
  };

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{event.name}</CardTitle>
                <CardDescription className="text-xs">
                  {event.period} | {event.location}
                </CardDescription>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(event)}
                >
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event)}
                >
                  削除
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {SEASON_LABELS[event.season] ?? event.season}
              </Badge>
              {event.themes.map((theme) => (
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
