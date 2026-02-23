"use client";

import { useState, useEffect, useCallback } from "react";
import { TravelPlan } from "@/types/plan";
import { getPlans, savePlan, deletePlan, getPlanById } from "@/lib/storage";

export function usePlans() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);

  useEffect(() => {
    setPlans(getPlans());
  }, []);

  const addPlan = useCallback((plan: TravelPlan) => {
    savePlan(plan);
    setPlans(getPlans());
  }, []);

  const removePlan = useCallback((id: string) => {
    deletePlan(id);
    setPlans(getPlans());
  }, []);

  const findPlan = useCallback((id: string) => {
    return getPlanById(id);
  }, []);

  return { plans, addPlan, removePlan, findPlan };
}
