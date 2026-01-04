import { useState } from "react";
import { AppData, Meal } from "../types";

interface MealsViewProps {
  data: AppData;
  addMeal: (name: string, category: Meal["category"], servings: number, ingredients: string[]) => void;
  deleteMeal: (id: number) => void;
}

const CATEGORIES: Meal["category"][] = ["breakfast", "lunch", "dinner"];

export function MealsView({ data, addMeal, deleteMeal }: MealsViewProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Meal["category"]>("breakfast");
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;

    const ingredientList = ingredients
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter(Boolean);

    addMeal(name, category, servings, ingredientList);

    setName("");
    setIngredients("");
    setServings(1);
  };

  return (
    <div className="container">
      <header>
        <h1>Basecamp</h1>
      </header>

      <div className="card">
        <div className="card-title">Add Meal</div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Meal name"
        />

        <div className="input-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Meal["category"])}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>

          <input
            type="number"
            min={1}
            max={7}
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            style={{ width: "60px", textAlign: "center" }}
          />
        </div>

        <input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients (comma separated)"
        />

        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleAdd}>
          Add Meal
        </button>
      </div>

      {CATEGORIES.map((cat) => {
        const catMeals = data.meals.filter((m) => m.category === cat);
        if (catMeals.length === 0) return null;

        return (
          <div key={cat} className="card">
            <div className="card-title">{cat}</div>

            {catMeals.map((meal) => (
              <div key={meal.id} className="meal-card">
                <div className="meal-header">
                  <div>
                    <span className="meal-name">{meal.name}</span>
                    <span className="meal-servings">{meal.servings}x</span>
                    <div className="meal-ingredients">{meal.ingredients.join(", ")}</div>
                  </div>
                  <button className="delete-btn" onClick={() => deleteMeal(meal.id)}>
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
