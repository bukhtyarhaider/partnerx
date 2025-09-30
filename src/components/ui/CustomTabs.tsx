import { createContext, useContext, useState, type ReactNode } from "react";

type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a <Tabs> component.");
  }
  return context;
}

type TabsProps = {
  children: ReactNode;
  defaultValue: string;
};

export function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = {
  children: ReactNode;
  className?: string;
};

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={`inline-flex space-x-1 border-b border-slate-200 dark:border-slate-700 ${className}`}
    >
      {children}
    </div>
  );
}

type TabsTriggerProps = {
  children: ReactNode;
  value: string;
  className?: string;
};

export function TabsTrigger({
  children,
  value,
  className = "",
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      data-state={isActive ? "active" : "inactive"}
      className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors
        ${
          isActive
            ? "border-green-500 text-green-600"
            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        }
        ${className}`}
    >
      {children}
    </button>
  );
}

type TabsContentProps = {
  children: ReactNode;
  value: string;
  className?: string;
};

export function TabsContent({
  children,
  value,
  className = "",
}: TabsContentProps) {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;

  return isActive ? (
    <div
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={`w-full py-4 transition-opacity animate-fade-in ${className}`}
    >
      {children}
    </div>
  ) : null;
}
