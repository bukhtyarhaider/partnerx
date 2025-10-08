import { TrendingUp, TrendingDown } from "lucide-react";
import type { Transaction, Expense } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/CustomTabs";
import { IncomeChart } from "./IncomeChart";
import { ExpenseAnalytics } from "./ExpenseAnalytics";

interface DesktopFinancialAnalyticsProps {
  transactions: Transaction[];
  expenses: Expense[];
}

export const DesktopFinancialAnalytics: React.FC<
  DesktopFinancialAnalyticsProps
> = ({ transactions, expenses }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-50 mb-4">
        Financial Analytics
      </h2>

      <Tabs defaultValue="income">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="income" className="flex items-center gap-2">
            <TrendingUp size={18} />
            <span>Income Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <TrendingDown size={18} />
            <span>Expense Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="mt-0">
          <IncomeChart transactions={transactions} />
        </TabsContent>

        <TabsContent value="expenses" className="mt-0">
          <ExpenseAnalytics expenses={expenses} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
