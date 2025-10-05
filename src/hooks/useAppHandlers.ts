import { useState, useEffect } from "react";
import type {
  Transaction,
  Expense,
  DonationPayout,
  FinancialSummaryRecord,
  NewTransactionEntry,
  NewExpenseEntry,
  NewDonationPayoutEntry,
  TransactionCalculations,
  AppHandlers,
  DonationConfig,
} from "../types";
import { incomeSourceService } from "../services/incomeSourceService";
import {
  loadTransactionsWithMigration,
  loadExpensesWithMigration,
} from "../utils/migration";

type EditableEntry = Transaction | Expense | DonationPayout;
type ModalType = "transaction" | "expense" | "donation" | null;

const DEFAULT_DONATION_CONFIG: DonationConfig = {
  percentage: 10,
  taxPreference: "before-tax",
  enabled: true,
};

export function useAppHandlers(): AppHandlers {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadTransactionsWithMigration()
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadExpensesWithMigration()
  );
  const [donationPayouts, setDonationPayouts] = useState<DonationPayout[]>(() =>
    JSON.parse(localStorage.getItem("donationPayouts") || "[]")
  );
  const [summaries, setSummaries] = useState<FinancialSummaryRecord[]>(() =>
    JSON.parse(localStorage.getItem("summaries") || "[]")
  );
  const [donationConfig, setDonationConfig] = useState<DonationConfig>(() => {
    // Priority: 1. Existing saved config, 2. Onboarding config, 3. Default
    const saved = localStorage.getItem("donationConfig");
    if (saved) {
      return { ...DEFAULT_DONATION_CONFIG, ...JSON.parse(saved) };
    }

    // Check for onboarding donation config
    const onboardingConfig = localStorage.getItem("onboarding_donation_config");
    if (onboardingConfig) {
      try {
        const config = JSON.parse(onboardingConfig);
        // Save onboarding config as the main config
        localStorage.setItem("donationConfig", JSON.stringify(config));
        return { ...DEFAULT_DONATION_CONFIG, ...config };
      } catch (error) {
        console.warn("Failed to parse onboarding donation config:", error);
      }
    }

    return DEFAULT_DONATION_CONFIG;
  });
  const [activeTab, setActiveTab] = useState<"income" | "expense" | "donation">(
    "income"
  );
  const [editingEntry, setEditingEntry] = useState<EditableEntry | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);

  // Save donation config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("donationConfig", JSON.stringify(donationConfig));
  }, [donationConfig]);

  const handleImport = (data: {
    transactions: Transaction[];
    expenses: Expense[];
    donationPayouts: DonationPayout[];
    summaries: FinancialSummaryRecord[];
    donationConfig?: DonationConfig;
  }) => {
    setTransactions(data.transactions || []);
    setExpenses(data.expenses || []);
    setDonationPayouts(data.donationPayouts || []);
    setSummaries(data.summaries || []);
    if (data.donationConfig) {
      setDonationConfig({ ...DEFAULT_DONATION_CONFIG, ...data.donationConfig });
    }
  };

  const recalculateTransaction = async (
    entry: NewTransactionEntry | Transaction,
    configOverride?: DonationConfig
  ): Promise<TransactionCalculations> => {
    const { amountUSD, conversionRate, sourceId, taxRate } = entry;
    const activeConfig = configOverride || donationConfig;

    // Get the income source to determine fees
    let feeUSD = 0;
    try {
      const source = await incomeSourceService.getSource(sourceId);
      if (source?.metadata?.fees) {
        const fees = source.metadata.fees;
        if (fees.method === "fixed") {
          feeUSD = fees.fixedFeeUSD || 0;
        } else if (fees.method === "percentage") {
          feeUSD = amountUSD * ((fees.percentageFee || 0) / 100);
        } else if (fees.method === "hybrid") {
          feeUSD =
            (fees.fixedFeeUSD || 0) +
            amountUSD * ((fees.percentageFee || 0) / 100);
        }
      }
    } catch (error) {
      console.warn(
        `Failed to get fee information for source ${sourceId}:`,
        error
      );
      // Fall back to legacy behavior for backward compatibility
      feeUSD = sourceId === "tiktok" ? 5.0 : 0;
    }

    const feePKR = feeUSD * conversionRate;
    const amountAfterFeesUSD = amountUSD - feeUSD;
    const grossPKR = amountAfterFeesUSD * conversionRate;

    let charityAmount = 0;
    let taxableAmount = grossPKR;

    if (activeConfig.enabled) {
      if (activeConfig.taxPreference === "before-tax") {
        // Calculate donation from gross amount before tax
        charityAmount = grossPKR * (activeConfig.percentage / 100);
        taxableAmount = grossPKR - charityAmount;
      } else {
        // Calculate donation from net amount after tax
        const tempTaxAmount = grossPKR * (taxRate / 100);
        const tempNetAmount = grossPKR - tempTaxAmount;
        charityAmount = tempNetAmount * (activeConfig.percentage / 100);
        taxableAmount = grossPKR; // Tax is calculated on full gross amount
      }

      // Apply min/max limits if configured
      if (
        activeConfig.minimumAmount &&
        charityAmount < activeConfig.minimumAmount
      ) {
        charityAmount = activeConfig.minimumAmount;
      }
      if (
        activeConfig.maximumAmount &&
        charityAmount > activeConfig.maximumAmount
      ) {
        charityAmount = activeConfig.maximumAmount;
      }
    }

    const taxAmount =
      activeConfig.taxPreference === "before-tax"
        ? taxableAmount * (taxRate / 100)
        : grossPKR * (taxRate / 100);

    const netProfit =
      activeConfig.taxPreference === "before-tax"
        ? taxableAmount - taxAmount
        : grossPKR - taxAmount - charityAmount;

    const partnerShare = netProfit;

    return {
      feePKR,
      grossPKR,
      charityAmount,
      taxAmount,
      netProfit,
      partnerShare,
    };
  };

  const handleAddTransaction = async (entry: NewTransactionEntry) => {
    const calculations = await recalculateTransaction(entry);
    const newTransaction: Transaction = {
      id: Date.now(),
      ...entry,
      calculations,
      donationConfigSnapshot: { ...donationConfig }, // Store current config
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };
  const handleAddExpense = (entry: NewExpenseEntry) =>
    setExpenses((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  const handleAddDonationPayout = (entry: NewDonationPayoutEntry) =>
    setDonationPayouts((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  const handleAddSummary = (text: string) => {
    const newSummary: FinancialSummaryRecord = {
      id: Date.now(),
      text,
      createdAt: new Date().toISOString(),
    };
    setSummaries((prev) => [newSummary, ...prev]);
  };

  const handleUpdateTransaction = async (updatedTx: Transaction) => {
    // Use the original donation config if available, otherwise use current config
    const configToUse = updatedTx.donationConfigSnapshot || donationConfig;
    updatedTx.calculations = await recalculateTransaction(
      updatedTx,
      configToUse
    );

    // Preserve the original donation config snapshot
    if (!updatedTx.donationConfigSnapshot) {
      updatedTx.donationConfigSnapshot = { ...donationConfig };
    }

    setTransactions(
      transactions.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
    setEditingEntry(null);
  };
  const handleUpdateExpense = (updatedEx: Expense) => {
    setExpenses(
      expenses.map((ex) => (ex.id === updatedEx.id ? updatedEx : ex))
    );
    setEditingEntry(null);
  };
  const handleUpdateDonationPayout = (updatedDp: DonationPayout) => {
    setDonationPayouts(
      donationPayouts.map((dp) => (dp.id === updatedDp.id ? updatedDp : dp))
    );
    setEditingEntry(null);
  };
  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };
  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((ex) => ex.id !== id));
  };
  const handleDeleteDonationPayout = (id: number) => {
    setDonationPayouts(donationPayouts.filter((dp) => dp.id !== id));
  };
  const handleDeleteSummary = (id: number) => {
    setSummaries((prev) => prev.filter((summary) => summary.id !== id));
  };

  const handleUpdateDonationConfig = (
    configUpdate: Partial<DonationConfig>
  ) => {
    const newConfig = { ...donationConfig, ...configUpdate };
    setDonationConfig(newConfig);
    localStorage.setItem("donationConfig", JSON.stringify(newConfig));

    // Note: Donation config changes only apply to new transactions, not existing ones
    // This preserves the historical accuracy of past transactions
  };

  const openEditModal = (
    entry: EditableEntry,
    type: "transaction" | "expense" | "donation"
  ) => {
    setEditingEntry(entry);
    setModalType(type);
  };

  return {
    transactions,
    setTransactions,
    expenses,
    setExpenses,
    donationPayouts,
    setDonationPayouts,
    summaries,
    setSummaries,
    donationConfig,
    setDonationConfig,
    activeTab,
    setActiveTab,
    editingEntry,
    setEditingEntry,
    modalType,
    setModalType,
    handleImport,
    handleAddTransaction,
    handleAddExpense,
    handleAddDonationPayout,
    handleAddSummary,
    handleUpdateTransaction,
    handleUpdateExpense,
    handleUpdateDonationPayout,
    handleDeleteTransaction,
    handleDeleteExpense,
    handleDeleteDonationPayout,
    handleDeleteSummary,
    handleUpdateDonationConfig,
    openEditModal,
  };
}
