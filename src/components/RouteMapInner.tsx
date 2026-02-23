"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RoutePoint } from "@/types/plan";

// 美唄周辺の妥当な座標範囲
function isValidCoord(lat: number, lng: number): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat !== 0 &&
    lng !== 0 &&
    lat >= 42 && lat <= 44.5 &&
    lng >= 140 && lng <= 143
  );
}

// 番号付きカスタムマーカーを作成
function createNumberedIcon(num: number) {
  return L.divIcon({
    className: "",
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:32px;height:32px;border-radius:50%;
      background:#2d7a4f;color:white;font-weight:700;font-size:14px;
      box-shadow:0 2px 8px rgba(45,122,79,0.4);
      border:2px solid white;
    ">${num}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

// bounds に合わせてマップをフィットさせるコンポーネント
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);
  return null;
}

interface RouteMapInnerProps {
  route: RoutePoint[];
}

export function RouteMapInner({ route }: RouteMapInnerProps) {
  const sorted = useMemo(
    () => [...route].sort((a, b) => a.order - b.order),
    [route]
  );

  // 有効な座標を持つポイントのみ表示
  const validPoints = useMemo(
    () => sorted.filter((p) => isValidCoord(p.lat, p.lng)),
    [sorted]
  );

  const positions = useMemo<[number, number][]>(
    () => validPoints.map((p) => [p.lat, p.lng]),
    [validPoints]
  );

  if (positions.length === 0) return null;

  // 美唄市の中心を初期位置に
  const center: [number, number] = [43.33, 141.95];

  return (
    <div className="w-full h-[350px] rounded-xl overflow-hidden border border-border/60 shadow-md">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={positions} />

        {/* ルートを結ぶ線 */}
        <Polyline
          positions={positions}
          pathOptions={{
            color: "#2d7a4f",
            weight: 3,
            opacity: 0.6,
            dashArray: "8 6",
          }}
        />

        {/* 各スポットのマーカー */}
        {validPoints.map((point, i) => (
          <Marker
            key={i}
            position={[point.lat, point.lng]}
            icon={createNumberedIcon(point.order)}
          >
            <Popup>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                {point.order}. {point.name}
              </div>
              {point.description && (
                <div style={{ fontSize: 12, color: "#666" }}>
                  {point.description}
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
