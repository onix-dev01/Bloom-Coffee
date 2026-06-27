"use client";

import { cn } from "@/lib/cn";

type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
};

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-brand-50 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition",
            activeTab === tab.id
              ? "bg-surface text-brand-900 shadow-sm"
              : "text-muted hover:text-brand-800",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
