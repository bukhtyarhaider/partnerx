import { useContext } from "react";
import { ExchangeRateContext } from "../contexts/exchangeRateContextDefinition";

export const useSharedExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (!context) {
    throw new Error(
      "useSharedExchangeRate must be used within an ExchangeRateProvider"
    );
  }
  return context;
};
