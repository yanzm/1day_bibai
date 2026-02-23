"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TravelForm } from "@/components/TravelForm";
import { GeneratingView } from "@/components/GeneratingView";
import { PlanFormData, TravelPlan } from "@/types/plan";
import { savePlan } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PlanFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "プランの生成に失敗しました");
      }

      const plan: TravelPlan = await response.json();
      savePlan(plan);
      router.push(`/plans/${plan.id}`);
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("プランの生成中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-4">
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-xl">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          いちにち美唄
        </h1>
        <p className="text-sm text-muted-foreground/60 tracking-widest">1 day bibai</p>
        <p className="text-muted-foreground text-lg leading-relaxed">
          テーマと季節を選ぶだけ。<br className="hidden sm:block" />
          地元の友達が案内するような1日プランをAIが作ります。
        </p>
      </div>

      {isLoading ? (
        <GeneratingView />
      ) : (
        <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}
