import { useId, useState } from "react";
import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const generatedId = useId();
  const [activeId, setActiveId] = useState(
    () => defaultTab ?? tabs[0]?.id ?? "",
  );

  const activeTab = tabs.find((tab) => tab.id === activeId);

  if (tabs.length === 0) return null;

  return (
    <div className="bt-ui-tabs">
      <div
        className="bt-ui-tabs-list"
        role="tablist"
        aria-label="Content sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${generatedId}-${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeId === tab.id}
            aria-controls={`${generatedId}-${tab.id}-panel`}
            tabIndex={activeId === tab.id ? 0 : -1}
            disabled={tab.disabled}
            className={`bt-ui-tab ${activeId === tab.id ? "is-active" : ""}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab && (
        <div
          key={activeTab.id}
          id={`${generatedId}-${activeTab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${generatedId}-${activeTab.id}-tab`}
          className="bt-ui-tab-panel"
          tabIndex={0}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
