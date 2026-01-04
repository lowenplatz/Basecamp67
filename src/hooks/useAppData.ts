import { useState, useEffect, useCallback } from "react";
import { AppData, Meal, StapleStatus } from "../types";
import { loadData, saveData } from "../firebase";
import { DEFAULT_DATA } from "../defaultData";
import { getWeekDays, getTodayStr } from "../utils";

export function useAppData() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData(DEFAULT_DATA)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (newData: AppData) => {
    setData(newData);
    await saveData(newData);
  }, []);

  const selectMeal = useCallback((date: string, slot: string, mealId: number) => {
    const meal = data.meals.find((m) => m.id === mealId);
    if (!meal) return;

    const newPlan = { ...data.plan };
    newPlan[`${date}-${slot}`] = { id: meal.id, name: meal.name };

    if (meal.servings > 1 && slot === meal.category) {
      const days = getWeekDays();
      const idx = days.indexOf(date);
      for (let i = 1; i < meal.servings && idx + i < days.length; i++) {
        const futureKey = `${days[idx + i]}-${slot}`;
        if (!newPlan[futureKey]) {
          newPlan[futureKey] = { id: meal.id, name: meal.name, isLeftover: true };
        }
      }
    }

    save({ ...data, plan: newPlan });
  }, [data, save]);

  const setSlotSpecial = useCallback((date: string, slot: string, value: "skip" | "out") => {
    save({ ...data, plan: { ...data.plan, [`${date}-${slot}`]: value } });
  }, [data, save]);

  const clearSlot = useCallback((date: string, slot: string) => {
    const newPlan = { ...data.plan };
    delete newPlan[`${date}-${slot}`];
    save({ ...data, plan: newPlan });
  }, [data, save]);

  const cycleStaple = useCallback((item: string) => {
    const order: StapleStatus[] = ["full", "low", "out"];
    const idx = order.indexOf(data.staples[item]);
    const newStatus = order[(idx + 1) % 3];
    save({ ...data, staples: { ...data.staples, [item]: newStatus } });
  }, [data, save]);

  const toggleOnHand = useCallback((item: string) => {
    const newOnHand = { ...data.onHand };
    if (newOnHand[item]) {
      delete newOnHand[item];
    } else {
      newOnHand[item] = true;
    }
    save({ ...data, onHand: newOnHand });
  }, [data, save]);

  const addMeal = useCallback((name: string, category: Meal["category"], servings: number, ingredients: string[]) => {
    const meal: Meal = {
      id: Date.now(),
      name,
      category,
      servings,
      ingredients,
    };
    save({ ...data, meals: [...data.meals, meal] });
  }, [data, save]);

  const deleteMeal = useCallback((id: number) => {
    save({ ...data, meals: data.meals.filter((m) => m.id !== id) });
  }, [data, save]);

  const addStaple = useCallback((name: string) => {
    const key = name.trim().toLowerCase();
    if (!key || data.staples[key]) return;
    save({ ...data, staples: { ...data.staples, [key]: "full" } });
  }, [data, save]);

  const removeStaple = useCallback((item: string) => {
    const newStaples = { ...data.staples };
    delete newStaples[item];
    save({ ...data, staples: newStaples });
  }, [data, save]);

  const setShoppingDay = useCallback((day: string | null) => {
    save({ ...data, shoppingDay: day });
  }, [data, save]);

  const getGroceryList = useCallback(() => {
    const start = data.shoppingDay || getTodayStr();
    const needed: Record<string, number | "staple"> = {};
    const days = getWeekDays().filter((d) => d >= start);

    for (const date of days) {
      for (const slot of ["breakfast", "lunch", "dinner"]) {
        const val = data.plan[`${date}-${slot}`];
        if (val && typeof val === "object" && !val.isLeftover) {
          const meal = data.meals.find((m) => m.id === val.id);
          if (meal) {
            for (const ing of meal.ingredients) {
              if (!data.staples[ing] && !data.onHand[ing]) {
                needed[ing] = ((needed[ing] as number) || 0) + 1;
              }
            }
          }
        }
      }
    }

    for (const [item, status] of Object.entries(data.staples)) {
      if (status === "low" || status === "out") {
        needed[item] = "staple";
      }
    }

    return needed;
  }, [data]);

  const markAllBought = useCallback(() => {
    const groceries = getGroceryList();
    const newOnHand = { ...data.onHand };
    const newStaples = { ...data.staples };

    for (const [item, type] of Object.entries(groceries)) {
      if (type === "staple") {
        newStaples[item] = "full";
      } else {
        newOnHand[item] = true;
      }
    }

    save({ ...data, onHand: newOnHand, staples: newStaples });
  }, [data, save, getGroceryList]);

  return {
    data,
    loading,
    selectMeal,
    setSlotSpecial,
    clearSlot,
    cycleStaple,
    toggleOnHand,
    addMeal,
    deleteMeal,
    addStaple,
    removeStaple,
    setShoppingDay,
    getGroceryList,
    markAllBought,
  };
}
