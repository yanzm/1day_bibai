"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Share2, Check } from "lucide-react";
import { TravelPlan } from "@/types/plan";
import { getPlanById, deletePlan } from "@/lib/storage";
import { PlanView } from "@/components/PlanView";
import { RouteMap } from "@/components/RouteMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function buildShareText(plan: TravelPlan): string {
  const title = plan.plan?.title ?? "美唄観光プラン";
  const route = (plan.route ?? []).sort((a, b) => a.order - b.order);

  const lines: string[] = [];
  lines.push(`🗺️ いちにち美唄 - ${title}`);
  lines.push("");
  lines.push(`テーマ: ${plan.themeName} / ${plan.seasonName}`);

  if (route.length > 0) {
    lines.push("");
    lines.push("📍 ルート:");
    route.forEach((p) => {
      lines.push(`${p.order}. ${p.name}`);
    });
  }

  lines.push("");
  lines.push("#いちにち美唄 #美唄");

  return lines.join("\n");
}

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const found = getPlanById(id);
    if (found) {
      setPlan(found);
    }
  }, [params.id]);

  const handleDelete = () => {
    if (!plan) return;
    if (confirm("このプランを削除しますか？")) {
      deletePlan(plan.id);
      router.push("/plans");
    }
  };

  const handleShare = async () => {
    if (!plan) return;

    const text = buildShareText(plan);
    const title = plan.plan?.title ?? "いちにち美唄";
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // ユーザーがキャンセルした場合は何もしない
      }
    } else {
      try {
        await navigator.clipboard.writeText(text + "\n" + url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // フォールバック: textarea経由でコピー
        const textarea = document.createElement("textarea");
        textarea.value = text + "\n" + url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (!plan) {
    return (
      <div className="text-center py-20 space-y-4">
        <span className="text-5xl block">😿</span>
        <h2 className="text-xl font-semibold">プランが見つかりません</h2>
        <p className="text-muted-foreground">
          指定されたプランは存在しないか、削除されています。
        </p>
        <Button
          className="mt-2 rounded-xl shadow-md shadow-primary/10"
          onClick={() => router.push("/")}
        >
          新しいプランを作成
        </Button>
      </div>
    );
  }

  const route = plan.route ?? [];

  return (
    <div className="space-y-6">
      {/* ヘッダーバー */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/plans")}
        >
          ← プラン一覧に戻る
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleShare}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                コピーしました
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-1.5" />
                シェア
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            削除
          </Button>
        </div>
      </div>

      {/* 2カラム: 本文 + スティッキー地図 */}
      <div className="flex gap-6 items-start">
        {/* 左カラム: プラン本文 */}
        <Card className="flex-1 min-w-0 shadow-lg shadow-primary/5 border-border/60">
          <CardContent className="p-6 sm:p-8">
            <PlanView plan={plan} />
          </CardContent>
        </Card>

        {/* 右カラム: スティッキー地図 (デスクトップのみ) */}
        {route.length > 0 && (
          <div className="hidden lg:block w-[420px] shrink-0 sticky top-24">
            <RouteMap route={route} />
          </div>
        )}
      </div>

      {/* モバイル: 地図を本文の下に表示 */}
      {route.length > 0 && (
        <div className="lg:hidden">
          <RouteMap route={route} />
        </div>
      )}
    </div>
  );
}
