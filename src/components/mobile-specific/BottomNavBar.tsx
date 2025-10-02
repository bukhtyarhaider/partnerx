import { BarChart2, Cog, List, Plus, type LucideIcon } from "lucide-react";
import type { Dispatch, JSX, SetStateAction, ComponentType } from "react";

export interface BottomNavBarProps {
  activeTab: "overview" | "history" | "settings";
  onTabChange: Dispatch<SetStateAction<"overview" | "history" | "settings">>;
  onAddClick: () => void;
  isAddOpen: boolean;
}

export const BottomNavBar = ({
  activeTab,
  onTabChange,
  onAddClick,
  isAddOpen,
}: BottomNavBarProps) => {
  const navItems: {
    id: BottomNavBarProps["activeTab"];
    label: string;
    icon: LucideIcon | ComponentType<JSX.IntrinsicElements["svg"]>;
  }[] = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "history", label: "History", icon: List },
    { id: "settings", label: "Settings", icon: Cog },
  ];

  return (
    <>
      <div className="h-24 md:hidden" aria-hidden />

      {!isAddOpen && (
        <button
          type="button"
          onClick={onAddClick}
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-emerald-500 to-green-600 p-3.5 text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/30 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
          aria-label="Add new entry"
        >
          <Plus
            size={22}
            className="transition-transform duration-300 hover:rotate-90"
          />
        </button>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-2xl dark:bg-slate-900/70"
        role="navigation"
        aria-label="Bottom Navigation"
      >
        <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-5 py-2.5 text-xs font-medium transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "bg-emerald-50/90 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                    : "text-slate-500 hover:bg-white/60 hover:text-emerald-500 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-emerald-400"
                }`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon
                  size={19}
                  className="transition-transform duration-200"
                />
                <span className="text-[10px] font-semibold tracking-tight">
                  {item.label}
                </span>

                {isActive && (
                  <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
