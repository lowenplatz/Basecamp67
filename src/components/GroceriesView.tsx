import { useState } from "react";
import { AppData } from "../types";
import { formatDate } from "../utils";

interface GroceriesViewProps {
  data: AppData;
  getGroceryList: () => Record<string, number | "staple">;
  markAllBought: () => void;
  cycleStaple: (item: string) => void;
  removeStaple: (item: string) => void;
  addStaple: (name: string) => void;
  toggleOnHand: (item: string) => void;
}

export function GroceriesView({
  data,
  getGroceryList,
  markAllBought,
  cycleStaple,
  removeStaple,
  addStaple,
  toggleOnHand,
}: GroceriesViewProps) {
  const [newStaple, setNewStaple] = useState("");

  const groceries = getGroceryList();
  const groceryKeys = Object.keys(groceries);
  const onHandKeys = Object.keys(data.onHand).filter((k) => data.onHand[k]);
  const stapleKeys = Object.keys(data.staples);

  const handleAddStaple = () => {
    if (newStaple.trim()) {
      addStaple(newStaple);
      setNewStaple("");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Basecamp</h1>
      </header>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Shopping List</div>
          {groceryKeys.length > 0 && (
            <button className="btn btn-primary btn-small" onClick={markAllBought}>
              Mark all bought
            </button>
          )}
        </div>

        {data.shoppingDay && (
          <p className="hint" style={{ marginBottom: "0.75rem" }}>
            For meals from {formatDate(data.shoppingDay)}
          </p>
        )}

        {groceryKeys.length === 0 ? (
          <div className="empty-state">All set! Nothing to buy.</div>
        ) : (
          groceryKeys.map((item) => (
            <div key={item} className="item-row">
              <span style={{ textTransform: "capitalize" }}>{item}</span>
              <span className="hint">
                {groceries[item] === "staple" ? "(staple - low)" : `x${groceries[item]} meals`}
              </span>
            </div>
          ))
        )}
      </div>

      {onHandKeys.length > 0 && (
        <div className="card">
          <div className="card-title">On Hand</div>
          <p className="hint" style={{ marginBottom: "0.75rem" }}>
            Tap to clear when you run out
          </p>
          <div>
            {onHandKeys.map((item) => (
              <span key={item} className="onhand-chip" onClick={() => toggleOnHand(item)}>
                {item} x
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Staples</div>
        <p className="hint" style={{ marginBottom: "0.75rem" }}>
          Always-stock items. Tap status to cycle.
        </p>

        {stapleKeys.map((item) => (
          <div key={item} className="item-row">
            <span style={{ textTransform: "capitalize" }}>{item}</span>
            <div>
              <button
                className={`status-pill status-${data.staples[item]}`}
                onClick={() => cycleStaple(item)}
              >
                {data.staples[item]}
              </button>
              <button className="delete-btn" onClick={() => removeStaple(item)}>
                x
              </button>
            </div>
          </div>
        ))}

        <div className="input-row" style={{ marginTop: "0.75rem" }}>
          <input
            value={newStaple}
            onChange={(e) => setNewStaple(e.target.value)}
            placeholder="Add staple..."
            onKeyDown={(e) => e.key === "Enter" && handleAddStaple()}
          />
          <button className="btn btn-secondary" onClick={handleAddStaple}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
