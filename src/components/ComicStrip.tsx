"use client";

import { useState } from "react";
import { ComicData, TravelPlan } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ComicStripProps {
  plan: TravelPlan;
  onComicGenerated: (comic: ComicData) => void;
}

export function ComicStrip({ plan, onComicGenerated }: ComicStripProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
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

  // 4コマが未生成の場合：生成ボタンを表示
  if (!plan.comic) {
    return (
      <Card className="p-6 text-center space-y-4 bg-amber-50/50 border-amber-200/60">
        <div className="text-4xl">🐦🍢</div>
        <div>
          <h3 className="text-lg font-bold">4コマ漫画</h3>
          <p className="text-sm text-muted-foreground mt-1">
            マミーちゃんとやきとり男が旅するオリジナル4コマ漫画を生成します
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🎨</span>
              生成中...（30秒ほどかかります）
            </span>
          ) : (
            "4コマ漫画を生成する"
          )}
        </Button>
      </Card>
    );
  }

  // 4コマが生成済みの場合：表示
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
