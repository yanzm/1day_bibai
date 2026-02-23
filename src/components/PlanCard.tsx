"use client";

import Link from "next/link";
import { TravelPlan } from "@/types/plan";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlanCardProps {
  plan: TravelPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const title = plan.plan?.title
    ?? plan.content?.split("\n").find((l) => l.trim().length > 0)?.replace(/^#+\s*/, "")
    ?? "美唄観光プラン";

  const spotCount = (plan.route ?? []).length;

  return (
    <Link href={`/plans/${plan.id}`}>
      <Card className="group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all border-border/60 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <CardDescription>
                {new Date(plan.createdAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            {spotCount > 0 && (
              <span className="shrink-0 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                {spotCount}スポット
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{plan.themeName}</Badge>
            <Badge variant="outline">{plan.seasonName}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
