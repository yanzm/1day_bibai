"use client";

import { useEffect, useState } from "react";
import { RoutePoint } from "@/types/plan";

interface RouteMapProps {
  route: RoutePoint[];
}

export function RouteMap({ route }: RouteMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ route: RoutePoint[] }> | null>(null);

  useEffect(() => {
    // Leaflet は SSR 非対応なので dynamic import
    import("./RouteMapInner").then((mod) => {
      setMapComponent(() => mod.RouteMapInner);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="w-full h-[350px] rounded-xl bg-muted/50 border border-border/60 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">地図を読み込み中...</span>
      </div>
    );
  }

  return <MapComponent route={route} />;
}
