import { useState } from "react";
import { ViewType } from "./types";
import { useAppData } from "./hooks/useAppData";
import { Nav } from "./components/Nav";
import { PlanView } from "./components/PlanView";
import { GroceriesView } from "./components/GroceriesView";
import { MealsView } from "./components/MealsView";
import "./App.css";

function App() {
  const [view, setView] = useState<ViewType>("plan");
  const {
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
  } = useAppData();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {view === "plan" && (
        <PlanView
          data={data}
          selectMeal={selectMeal}
          setSlotSpecial={setSlotSpecial}
          clearSlot={clearSlot}
          setShoppingDay={setShoppingDay}
        />
      )}

      {view === "groceries" && (
        <GroceriesView
          data={data}
          getGroceryList={getGroceryList}
          markAllBought={markAllBought}
          cycleStaple={cycleStaple}
          removeStaple={removeStaple}
          addStaple={addStaple}
          toggleOnHand={toggleOnHand}
        />
      )}

      {view === "meals" && (
        <MealsView data={data} addMeal={addMeal} deleteMeal={deleteMeal} />
      )}

      <Nav view={view} setView={setView} />
    </div>
  );
}

export default App;
