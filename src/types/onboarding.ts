export interface BusinessInfo {
  name: string;
  type:
    | "personal"
    | "sole-proprietorship"
    | "partnership"
    | "llc"
    | "corporation"
    | "non-profit"
    | "other";
  phone?: string;
  email?: string;
  description?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  skippable?: boolean;
}

export interface OnboardingProgress {
  currentStepIndex: number;
  steps: OnboardingStep[];
  businessInfo?: BusinessInfo;
  completedAt?: string;
}

export interface OnboardingContextValue {
  progress: OnboardingProgress;
  businessInfo: BusinessInfo | null;
  isCompleted: boolean;

  // Navigation
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (stepIndex: number) => void;

  // Business info management
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;

  // Completion
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Step management
  markStepCompleted: (stepId: string) => void;
  canProceedToNextStep: () => boolean;
}

export type OnboardingStepComponent =
  | "business-info"
  | "add-partners"
  | "income-sources"
  | "donation-config"
  | "pin-setup";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "business-info",
    title: "Account Setup",
    description: "Basic information",
    completed: false,
    skippable: false,
  },
  {
    id: "income-sources",
    title: "Income Sources",
    description: "Add your platforms",
    completed: false,
    skippable: true,
  },
  {
    id: "add-partners",
    title: "Partners",
    description: "Optional for businesses",
    completed: false,
    skippable: true,
  },
  {
    id: "donation-config",
    title: "Donations",
    description: "Optional charitable giving",
    completed: false,
    skippable: true,
  },
  {
    id: "pin-setup",
    title: "Security",
    description: "Create your PIN",
    completed: false,
    skippable: false,
  },
];

export const BUSINESS_TYPES = [
  { value: "personal", label: "Personal Use", icon: "User" },
  {
    value: "sole-proprietorship",
    label: "Sole Proprietorship",
    icon: "Briefcase",
  },
  { value: "partnership", label: "Partnership", icon: "Users" },
  { value: "llc", label: "LLC", icon: "Building2" },
  { value: "corporation", label: "Corporation", icon: "Building" },
  { value: "non-profit", label: "Non-Profit", icon: "Heart" },
  { value: "other", label: "Other", icon: "MoreHorizontal" },
] as const;
