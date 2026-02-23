import { TravelPlan } from "@/types/plan";
import { saveComic, deleteComic } from "@/lib/comic-storage";

const STORAGE_KEY = "bibai_travel_plans";

/** localStorage から comic フィールドを除外して保存するためのヘルパー */
function stripComic(plan: TravelPlan): TravelPlan {
  const { comic: _, ...rest } = plan;
  return rest as TravelPlan;
}

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
  const planToStore = stripComic(plan);
  if (existingIndex >= 0) {
    plans[existingIndex] = planToStore;
  } else {
    plans.unshift(planToStore);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));

  // comic があれば IndexedDB に保存
  if (plan.comic) {
    saveComic(plan.id, plan.comic).catch((e) =>
      console.error("Failed to save comic to IndexedDB:", e)
    );
  }
}

export function deletePlan(id: string): void {
  const plans = getPlans().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  deleteComic(id).catch((e) =>
    console.error("Failed to delete comic from IndexedDB:", e)
  );
}

/**
 * 既存の localStorage に残っている comic データを IndexedDB へ移行し、
 * localStorage からは除去する。アプリ起動時に1回呼ぶ。
 */
export async function migrateComicsToIndexedDB(): Promise<void> {
  if (typeof window === "undefined") return;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;

  const plans: TravelPlan[] = JSON.parse(data);
  let migrated = false;

  for (const plan of plans) {
    if (plan.comic) {
      await saveComic(plan.id, plan.comic);
      delete plan.comic;
      migrated = true;
    }
  }

  if (migrated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }
}
