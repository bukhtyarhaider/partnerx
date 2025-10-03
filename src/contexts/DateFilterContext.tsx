import React, { useState } from "react";
import type { DateFilterValue } from "../components/DateFilter";
import { getDefaultDateFilter } from "../utils/dateFilter";
import { DateFilterContext } from "./DateFilterContextBase";

interface DateFilterProviderProps {
  children: React.ReactNode;
}

export const DateFilterProvider = ({ children }: DateFilterProviderProps) => {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>(
    getDefaultDateFilter()
  );

  return (
    <DateFilterContext.Provider value={{ dateFilter, setDateFilter }}>
      {children}
    </DateFilterContext.Provider>
  );
};
