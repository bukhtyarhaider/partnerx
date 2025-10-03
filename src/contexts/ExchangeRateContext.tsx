import React from "react";
import type { ReactNode } from "react";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { ExchangeRateContext } from "./exchangeRateContextDefinition";

interface ExchangeRateProviderProps {
  children: ReactNode;
}

export const ExchangeRateProvider: React.FC<ExchangeRateProviderProps> = ({
  children,
}) => {
  const exchangeRateData = useExchangeRate({
    apiKey: import.meta.env.VITE_EXCHANGE_RATE_API_KEY,
    autoFetch: true,
  });

  return (
    <ExchangeRateContext.Provider value={exchangeRateData}>
      {children}
    </ExchangeRateContext.Provider>
  );
};
