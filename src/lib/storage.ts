import { TravelPlan } from "@/types/plan";

const STORAGE_KEY = "bibai_travel_plans";

export function getPlans(): TravelPlan[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data) as TravelPlan[];
}

export function getPlanById(id: string): TravelPlan | undefined {
  const plans = getPlans();
  return plans.find((p) => p.id === id);
}

export function savePlan(plan: TravelPlan): void {
  const plans = getPlans();
  const existingIndex = plans.findIndex((p) => p.id === plan.id);
  if (existingIndex >= 0) {
    plans[existingIndex] = plan;
  } else {
    plans.unshift(plan);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function deletePlan(id: string): void {
  const plans = getPlans().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}
