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
      <div className="h-28 md:hidden" aria-hidden />

      {!isAddOpen && (
        <button
          type="button"
          onClick={onAddClick}
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-green-500 p-4 text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400 dark:focus:ring-green-600"
          aria-label="Add"
        >
          <Plus
            size={28}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
        </button>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 rounded-t-xl border-t border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/90"
        role="navigation"
        aria-label="Bottom Navigation"
      >
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "text-green-600"
                    : "text-slate-500 hover:text-green-500 dark:text-slate-400"
                }`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon size={22} />
                <span className="text-[11px] tracking-tight">{item.label}</span>

                {isActive && (
                  <span className="absolute -bottom-[3px] h-1 w-1 rounded-full bg-green-500 shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
