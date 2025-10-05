const PIN_STORAGE_KEY = "app_pin_code";

export const usePinReset = () => {
  const resetPinAndData = () => {
    const keysToRemove = [
      PIN_STORAGE_KEY,
      "transactions",
      "expenses",
      "donationPayouts",
      "summaries",
      "donationConfig",
      "partnerConfig",
      "incomeSourceConfig",
      "onboarding_partners",
      "onboarding_income_sources",
      "onboarding_donation_config",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  return { resetPinAndData };
};
