import { createContext } from "react";
import type { DateFilterValue } from "../components/DateFilter";

export interface DateFilterContextType {
  dateFilter: DateFilterValue;
  setDateFilter: (filter: DateFilterValue) => void;
}

export const DateFilterContext = createContext<
  DateFilterContextType | undefined
>(undefined);
