"use client";

import ReactMarkdown from "react-markdown";
import { TravelPlan } from "@/types/plan";
import { Badge } from "@/components/ui/badge";
import { PhotoGallery } from "@/components/PhotoGallery";

interface PlanViewProps {
  plan: TravelPlan;
}

export function PlanView({ plan }: PlanViewProps) {
  const route = (plan.route ?? []).sort((a, b) => a.order - b.order);
  const p = plan.plan;

  // 旧形式（content のみ）の場合
  if (!p && plan.content) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{plan.themeName}</Badge>
          <Badge variant="outline">{plan.seasonName}</Badge>
        </div>
        <article className="prose prose-gray max-w-none dark:prose-invert">
          <ReactMarkdown>{plan.content}</ReactMarkdown>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ヘッダー: バッジ */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="text-sm px-3 py-1">{plan.themeName}</Badge>
        <Badge variant="outline" className="text-sm px-3 py-1">{plan.seasonName}</Badge>
      </div>

      {/* タイトル・導入 */}
      {p && (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">{p.title}</h2>
          <p className="text-muted-foreground leading-relaxed text-base">{p.intro}</p>
        </div>
      )}

      {/* ルートタイムライン */}
      {route.length > 0 && (
        <div className="relative">
          {/* 縦のライン */}
          <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/5" />

          <div className="space-y-0">
            {route.map((point, i) => (
              <div key={i} className="relative">
                {/* コネクタ（2番目以降のアイテム） */}
                {i > 0 && <div className="h-6" />}

                <div className="flex gap-4 items-start">
                  {/* 番号サークル */}
                  <div className="relative z-10 shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20">
                    {point.order}
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={point.mapUrl || `https://www.google.com/maps?q=${point.lat},${point.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-base font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {point.name}
                        <span className="text-muted-foreground text-xs">↗</span>
                      </a>
                      {point.time && (
                        <span className="text-xs text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                          {point.time}
                        </span>
                      )}
                    </div>
                    {point.description && (
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    )}
                    <PhotoGallery photos={point.photos ?? []} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 帰り道・注意書き */}
      {p && (
        <div className="space-y-4 border-t border-border/60 pt-6">
          {p.closing && (
            <p className="text-foreground leading-relaxed">{p.closing}</p>
          )}
          {p.notes && (
            <div className="rounded-xl bg-muted/50 border border-border/60 px-4 py-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{p.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
