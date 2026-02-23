"use client";

import { useState, useEffect, useRef } from "react";
import { ComicData, TravelPlan } from "@/types/plan";
import { Card } from "@/components/ui/card";

interface ComicStripProps {
  plan: TravelPlan;
  onComicGenerated: (comic: ComicData) => void;
}

export function ComicStrip({ plan, onComicGenerated }: ComicStripProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasTriggered = useRef(false);

  const generateComic = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const spots = (plan.route ?? []).map((r) => r.name);
      const res = await fetch("/api/generate-comic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTitle: plan.plan?.title ?? "",
          planIntro: plan.plan?.intro ?? "",
          spots,
          theme: plan.themeName,
          season: plan.seasonName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成に失敗しました");
      }

      const comic: ComicData = await res.json();
      onComicGenerated(comic);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setIsGenerating(false);
    }
  };

  // 未生成なら自動トリガー
  useEffect(() => {
    if (plan.comic || hasTriggered.current) return;
    hasTriggered.current = true;
    generateComic();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 生成中
  if (isGenerating) {
    return (
      <Card className="p-6 text-center space-y-4 bg-amber-50/50 border-amber-200/60">
        <div className="relative w-20 h-20 mx-auto">
          <div className="h-20 w-20 rounded-full border-4 border-muted animate-spin border-t-amber-500" />
          <span className="absolute inset-0 flex items-center justify-center">
            <img
              src="/characters/mamy.png"
              alt="マミーちゃん"
              className="h-12 w-12 object-contain animate-bounce"
            />
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold">4コマ漫画を生成中...</h3>
          <p className="text-sm text-muted-foreground mt-1">
            マミーちゃんとやきとり男が冒険の準備中ガン
          </p>
        </div>
      </Card>
    );
  }

  // エラー
  if (error && !plan.comic) {
    return (
      <Card className="p-6 text-center space-y-3 bg-amber-50/50 border-amber-200/60">
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={generateComic}
          className="text-sm text-amber-700 underline hover:text-amber-900"
        >
          もう一度試す
        </button>
      </Card>
    );
  }

  // 未生成（自動トリガー前）
  if (!plan.comic) {
    return null;
  }

  // 生成済み：表示
  return (
    <Card className="overflow-hidden bg-amber-50/50 border-amber-200/60">
      <div className="p-4 border-b border-amber-200/60">
        <h3 className="text-lg font-bold text-center">
          🐦🍢 {plan.comic.title}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {plan.comic.panels.map((panel, i) => (
          <div key={i} className="relative">
            <img
              src={panel}
              alt={`4コマ漫画 第${i + 1}コマ`}
              className="w-full rounded-lg border-2 border-gray-800/20"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
