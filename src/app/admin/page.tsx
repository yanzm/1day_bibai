"use client";

import { useEffect, useState, useCallback } from "react";
import { Spot, Event } from "@/types/spot";
import { SpotList } from "@/components/admin/SpotList";
import { SpotForm } from "@/components/admin/SpotForm";
import { EventList } from "@/components/admin/EventList";
import { EventForm } from "@/components/admin/EventForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = "spots" | "events";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("spots");

  // Spots state
  const [spots, setSpots] = useState<Spot[]>([]);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [isCreatingSpot, setIsCreatingSpot] = useState(false);

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const [loading, setLoading] = useState(true);

  const fetchSpots = useCallback(async () => {
    const res = await fetch("/api/spots");
    const data = await res.json();
    setSpots(data);
  }, []);

  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  }, []);

  useEffect(() => {
    Promise.all([fetchSpots(), fetchEvents()]).then(() => setLoading(false));
  }, [fetchSpots, fetchEvents]);

  // Spot handlers
  const handleCreateSpot = async (spot: Spot | Omit<Spot, "id">) => {
    const res = await fetch("/api/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spot),
    });
    if (res.ok) {
      setIsCreatingSpot(false);
      fetchSpots();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const handleUpdateSpot = async (spot: Spot | Omit<Spot, "id">) => {
    if (!("id" in spot)) return;
    const res = await fetch(`/api/spots/${spot.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spot),
    });
    if (res.ok) {
      setEditingSpot(null);
      fetchSpots();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const handleDeleteSpot = async (id: string) => {
    const res = await fetch(`/api/spots/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchSpots();
    }
  };

  // Event handlers
  const handleCreateEvent = async (event: Event | Omit<Event, "id">) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (res.ok) {
      setIsCreatingEvent(false);
      fetchEvents();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const handleUpdateEvent = async (event: Event | Omit<Event, "id">) => {
    if (!("id" in event)) return;
    const res = await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (res.ok) {
      setEditingEvent(null);
      fetchEvents();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchEvents();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center text-muted-foreground">
        読み込み中...
      </div>
    );
  }

  const isEditing =
    tab === "spots"
      ? isCreatingSpot || !!editingSpot
      : isCreatingEvent || !!editingEvent;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab("spots")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
            tab === "spots"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          スポット ({spots.length})
        </button>
        <button
          onClick={() => setTab("events")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
            tab === "events"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          イベント ({events.length})
        </button>
      </div>

      {tab === "spots" && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">スポット管理</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {spots.length} 件のスポットが登録されています
              </p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsCreatingSpot(true)}>
                スポットを追加
              </Button>
            )}
          </div>

          {isCreatingSpot && (
            <SpotForm
              onSave={handleCreateSpot}
              onCancel={() => setIsCreatingSpot(false)}
            />
          )}

          {editingSpot && (
            <SpotForm
              spot={editingSpot}
              onSave={handleUpdateSpot}
              onCancel={() => setEditingSpot(null)}
            />
          )}

          {!isCreatingSpot && !editingSpot && (
            <SpotList
              spots={spots}
              onEdit={(spot) => setEditingSpot(spot)}
              onDelete={handleDeleteSpot}
            />
          )}
        </>
      )}

      {tab === "events" && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">イベント管理</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {events.length} 件のイベントが登録されています
              </p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsCreatingEvent(true)}>
                イベントを追加
              </Button>
            )}
          </div>

          {isCreatingEvent && (
            <EventForm
              onSave={handleCreateEvent}
              onCancel={() => setIsCreatingEvent(false)}
            />
          )}

          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSave={handleUpdateEvent}
              onCancel={() => setEditingEvent(null)}
            />
          )}

          {!isCreatingEvent && !editingEvent && (
            <EventList
              events={events}
              onEdit={(event) => setEditingEvent(event)}
              onDelete={handleDeleteEvent}
            />
          )}
        </>
      )}
    </div>
  );
}
