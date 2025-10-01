import React from "react";
import * as LucideIcons from "lucide-react";
import type { IncomeSource } from "../../types/incomeSource";

interface IncomeSourceIconProps {
  source: IncomeSource;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const IncomeSourceIcon: React.FC<IncomeSourceIconProps> = ({
  source,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 ",
    md: "h-5 ",
    lg: "h-6 ",
  };

  const iconSize = sizeClasses[size];

  if (!source.metadata?.icon) {
    // Default fallback icon
    const DefaultIcon = LucideIcons.DollarSign;
    return <DefaultIcon className={`${iconSize} ${className}`} />;
  }

  const { icon } = source.metadata;

  if (icon.type === "image") {
    return (
      <img
        src={icon.value}
        alt={source.name}
        className={`${iconSize} ${className}`}
      />
    );
  }

  if (icon.type === "lucide") {
    // Type-safe dynamic icon access
    const IconComponent = LucideIcons[
      icon.value as keyof typeof LucideIcons
    ] as React.ComponentType<{
      className?: string;
      style?: React.CSSProperties;
    }>;

    if (IconComponent && typeof IconComponent === "function") {
      return (
        <IconComponent
          className={`${iconSize} ${className}`}
          style={{ color: icon.color }}
        />
      );
    }
  }

  // Fallback if icon not found
  const FallbackIcon = LucideIcons.DollarSign;
  return <FallbackIcon className={`${iconSize} ${className}`} />;
};

interface IncomeSourceDisplayProps {
  source: IncomeSource;
  showDescription?: boolean;
  className?: string;
  date?: string;
}

export const IncomeSourceDisplay: React.FC<IncomeSourceDisplayProps> = ({
  source,
  showDescription = false,
  className = "",
  date,
}) => {
  const displayName = source.metadata?.display?.displayName || source.name;
  const description = source.metadata?.display?.description;

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full`}
        style={{
          backgroundColor: source.metadata?.icon?.backgroundColor || "#f1f5f9",
        }}
      >
        <IncomeSourceIcon source={source} size="md" />
      </div>
      <div>
        <div className="font-medium text-slate-900 dark:text-slate-50">
          {displayName}
        </div>
        {showDescription && description && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </div>
        )}
        {date && (
          <div className="ml-auto">
            <div className="text-slate-500 dark:text-slate-400">
              <div className="text-xsm text-slate-500 dark:text-slate-400">
                {date}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
