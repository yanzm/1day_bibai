"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function GeneratingView() {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg shadow-primary/5 border-border/60">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          プランを生成中...
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-muted animate-spin border-t-primary" />
          <span className="absolute inset-0 flex items-center justify-center">
            <img
              src="/characters/mamy.png"
              alt="マミーちゃん"
              className="h-14 w-14 object-contain animate-bounce"
            />
          </span>
        </div>
        <div className="text-center space-y-2">
          <p className="text-foreground font-medium">
            マミーちゃんがあなたのための美唄プランを考え中ガン...
          </p>
          <p className="text-muted-foreground text-sm">
            少々お待ちください（30秒〜1分程度）
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
