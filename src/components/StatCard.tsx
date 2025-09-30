import type { ReactNode } from "react";

type StatCardVariant = "green" | "red" | "blue" | "indigo" | "pink";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  variant?: StatCardVariant;
}

const variants: Record<StatCardVariant, { bg: string; shadow: string }> = {
  indigo: { bg: "bg-indigo-500", shadow: "shadow-indigo-500/30" },
  red: { bg: "bg-red-500", shadow: "shadow-red-500/30" },
  green: { bg: "bg-green-500", shadow: "shadow-green-500/30" },
  blue: { bg: "bg-blue-500", shadow: "shadow-blue-500/30" },
  pink: { bg: "bg-pink-500", shadow: "shadow-pink-500/30" },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  variant = "indigo",
}) => {
  const selectedVariant = variants[variant];

  return (
    <div className="relative transform rounded-2xl border border-slate-100 bg-white p-6 pt-8 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/50">
      <div
        className={`absolute -top-5 left-5 rounded-xl p-4 shadow-lg ${selectedVariant.bg} ${selectedVariant.shadow}`}
      >
        {icon}
      </div>

      <div className="flex flex-col items-end">
        <p className="font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h3 className="mt-1 text-3xl font-bold text-slate-800 dark:text-slate-50">
          {value}
        </h3>
      </div>
    </div>
  );
};
