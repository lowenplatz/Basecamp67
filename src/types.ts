export interface Meal {
  id: number;
  name: string;
  category: "breakfast" | "lunch" | "dinner";
  servings: number;
  ingredients: string[];
}

export interface PlanSlot {
  id: number;
  name: string;
  isLeftover?: boolean;
}

export type SlotValue = PlanSlot | "skip" | "out" | undefined;

export type StapleStatus = "full" | "low" | "out";

export interface AppData {
  meals: Meal[];
  staples: Record<string, StapleStatus>;
  onHand: Record<string, boolean>;
  plan: Record<string, SlotValue>;
  shoppingDay: string | null;
}

export type ViewType = "plan" | "groceries" | "meals";
