import { ViewType } from "../types";

interface NavProps {
  view: ViewType;
  setView: (v: ViewType) => void;
}

export function Nav({ view, setView }: NavProps) {
  const tabs: { id: ViewType; label: string; icon: string }[] = [
    { id: "plan", label: "Plan", icon: "▦" },
    { id: "groceries", label: "Groceries", icon: "◎" },
    { id: "meals", label: "Meals", icon: "◉" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-btn ${view === tab.id ? "active" : ""}`}
            onClick={() => setView(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
