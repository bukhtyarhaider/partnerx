export interface BusinessInfo {
  name: string;
  type:
    | "sole-proprietorship"
    | "partnership"
    | "llc"
    | "corporation"
    | "non-profit"
    | "other";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
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
    title: "Business Information",
    description: "Tell us about your business",
    completed: false,
    skippable: false,
  },
  {
    id: "add-partners",
    title: "Add Partners",
    description: "Set up your business partners",
    completed: false,
    skippable: true,
  },
  {
    id: "income-sources",
    title: "Income Sources",
    description: "Configure your revenue streams",
    completed: false,
    skippable: true,
  },
  {
    id: "donation-config",
    title: "Donation Settings",
    description: "Set up charitable giving preferences",
    completed: false,
    skippable: true,
  },
  {
    id: "pin-setup",
    title: "Security Setup",
    description: "Create a secure PIN for your account",
    completed: false,
    skippable: false,
  },
];

export const BUSINESS_TYPES = [
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "corporation", label: "Corporation" },
  { value: "non-profit", label: "Non-Profit Organization" },
  { value: "other", label: "Other" },
] as const;
