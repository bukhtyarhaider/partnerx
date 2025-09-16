import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  HeartHandshake,
  Scale,
} from "lucide-react";
import type { PartnerName } from "../types";

type Financials = {
  totalNetProfit: number;
  totalExpenses: number;
  companyCapital: number;
  availableDonationsFund: number;
  loan: {
    amount: number;
    owedBy: PartnerName | null;
  };
};

interface DashboardProps {
  financials: Financials;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);

export const Dashboard: React.FC<DashboardProps> = ({ financials }) => {
  const {
    totalNetProfit,
    totalExpenses,
    companyCapital,
    loan,
    availableDonationsFund,
  } = financials;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <StatCard
        icon={<ArrowUpRight className="text-green-500" />}
        title="Total Earnings (Net)"
        value={formatCurrency(totalNetProfit)}
      />
      <StatCard
        icon={<ArrowDownRight className="text-red-500" />}
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
      />
      <StatCard
        icon={<Banknote className="text-blue-500" />}
        title="Current Capital"
        value={formatCurrency(companyCapital)}
      />
      <StatCard
        icon={<HeartHandshake className="text-pink-500" />}
        title="Donations Fund"
        value={formatCurrency(availableDonationsFund)}
      />
      <LoanCard loan={loan} />
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
}> = ({ icon, title, value }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-wise-blue-light rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-wise-blue">{value}</p>
      </div>
    </div>
  </div>
);

const LoanCard: React.FC<{ loan: Financials["loan"] }> = ({ loan }) => {
  let content;
  if (loan.owedBy && loan.amount > 0) {
    content = (
      <>
        <p className="text-sm text-slate-500 font-medium">
          To Settle:{" "}
          <span className="font-bold text-amber-600">{loan.owedBy}</span> owes
        </p>
        <p className="text-2xl font-bold text-wise-blue">
          {formatCurrency(loan.amount)}
        </p>
      </>
    );
  } else {
    content = (
      <>
        <p className="text-sm text-slate-500 font-medium">Partner Expenses</p>
        <p className="text-2xl font-bold text-wise-green">Perfectly Balanced</p>
      </>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-wise-blue-light rounded-full">
          <Scale className="text-amber-500" />
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};
