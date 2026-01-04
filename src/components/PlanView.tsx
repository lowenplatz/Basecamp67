import { useState } from "react";
import { AppData, Meal, SlotValue } from "../types";
import { getWeekDays, formatDate, isToday } from "../utils";

interface PlanViewProps {
  data: AppData;
  selectMeal: (date: string, slot: string, mealId: number) => void;
  setSlotSpecial: (date: string, slot: string, value: "skip" | "out") => void;
  clearSlot: (date: string, slot: string) => void;
  setShoppingDay: (day: string | null) => void;
}

const SLOTS = ["breakfast", "lunch", "dinner"] as const;

export function PlanView({ data, selectMeal, setSlotSpecial, clearSlot, setShoppingDay }: PlanViewProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const days = getWeekDays();

  const getSlotDisplay = (val: SlotValue) => {
    if (!val) return { className: "slot-empty", content: "+ Add" };
    if (val === "skip") return { className: "slot-skip", content: "Skip" };
    if (val === "out") return { className: "slot-out", content: "Out" };
    if (val.isLeftover) return { className: "slot-leftover", content: `L: ${val.name}` };
    return { className: "slot-meal", content: val.name };
  };

  const getMealsForSlot = (slot: string): Meal[] => {
    return data.meals.filter(
      (m) => m.category === slot || (slot === "lunch" && m.category === "dinner") || (slot === "dinner" && m.category === "lunch")
    );
  };

  const handleSlotClick = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleSelect = (date: string, slot: string, mealId: number) => {
    selectMeal(date, slot, mealId);
    setOpenDropdown(null);
  };

  const handleSpecial = (date: string, slot: string, value: "skip" | "out") => {
    setSlotSpecial(date, slot, value);
    setOpenDropdown(null);
  };

  const handleClear = (date: string, slot: string) => {
    clearSlot(date, slot);
    setOpenDropdown(null);
  };

  return (
    <div className="container">
      <header>
        <h1>Basecamp</h1>
      </header>

      <div className="top-row">
        <span className="hint">Tap a slot to plan</span>
        <div className="shop-select">
          <span className="hint">Shop: </span>
          <select
            value={data.shoppingDay || ""}
            onChange={(e) => setShoppingDay(e.target.value || null)}
          >
            <option value="">Not set</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {formatDate(d)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {days.map((date) => (
        <div key={date} className={`card ${isToday(date) ? "today" : ""}`}>
          <div className={`date-header ${isToday(date) ? "today" : ""}`}>
            {formatDate(date)}
            {data.shoppingDay === date && <span className="badge">Shop</span>}
          </div>

          <div className="slots">
            {SLOTS.map((slot) => {
              const key = `${date}-${slot}`;
              const val = data.plan[key];
              const display = getSlotDisplay(val);
              const isOpen = openDropdown === key;
              const meals = getMealsForSlot(slot);

              return (
                <div key={slot} className="slot-wrapper">
                  <button
                    className={`slot ${display.className}`}
                    onClick={() => handleSlotClick(key)}
                  >
                    <div className="slot-label">{slot}</div>
                    <div className="slot-content">{display.content}</div>
                  </button>

                  {isOpen && (
                    <div className="dropdown">
                      <button className="dropdown-item" onClick={() => handleClear(date, slot)}>
                        Clear
                      </button>
                      <button className="dropdown-item" onClick={() => handleSpecial(date, slot, "skip")}>
                        Skip meal
                      </button>
                      <button className="dropdown-item" onClick={() => handleSpecial(date, slot, "out")}>
                        Eating out
                      </button>
                      <div className="dropdown-divider" />
                      {meals.map((meal) => (
                        <button
                          key={meal.id}
                          className="dropdown-item"
                          onClick={() => handleSelect(date, slot, meal.id)}
                        >
                          {meal.name}
                          {meal.servings > 1 && ` (${meal.servings}x)`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
