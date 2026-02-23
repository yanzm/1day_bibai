"use client";

import Link from "next/link";
import { usePlans } from "@/hooks/usePlans";
import { PlanCard } from "@/components/PlanCard";
import { Button } from "@/components/ui/button";

export default function PlansPage() {
  const { plans } = usePlans();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">保存済みプラン</h1>
          {plans.length > 0 && (
            <p className="text-muted-foreground mt-1">
              {plans.length}件のプラン
            </p>
          )}
        </div>
        <Link href="/">
          <Button className="rounded-xl shadow-md shadow-primary/10">
            新しいプランを作成
          </Button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <span className="text-5xl block">🗺️</span>
          <div className="space-y-2">
            <p className="text-foreground text-lg font-medium">
              まだプランがありません
            </p>
            <p className="text-muted-foreground">
              テーマと季節を選んで、美唄の1日プランを作ってみましょう
            </p>
          </div>
          <Link href="/">
            <Button className="mt-2 rounded-xl shadow-md shadow-primary/10">
              プランを作成する
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
