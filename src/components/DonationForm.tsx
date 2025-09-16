import { useState, useEffect } from "react";
import { PlusCircle, Save } from "lucide-react";
import type { NewDonationPayoutEntry, DonationPayout } from "../types";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: DonationPayout;
  onAddDonationPayout?: (entry: NewDonationPayoutEntry) => void;
  onSave?: (entry: DonationPayout) => void;
  availableFunds: number;
}

const getTodayString = () =>
  new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000)
    .toISOString()
    .split("T")[0];
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);

export const DonationForm: React.FC<FormProps> = ({
  mode = "add",
  initialData,
  onAddDonationPayout,
  onSave,
  availableFunds,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [paidTo, setPaidTo] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setAmount(String(initialData.amount));
      setDate(initialData.date);
      setPaidTo(initialData.paidTo);
      setDescription(initialData.description);
    }
  }, [mode, initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payoutAmount = parseFloat(amount);
    if (!payoutAmount || !date || !paidTo) {
      alert("Please fill out Date, Amount, and Paid To fields.");
      return;
    }
    if (payoutAmount > availableFunds) {
      alert(
        `Cannot process payout. Amount exceeds available fund of ${formatCurrency(
          availableFunds
        )}.`
      );
      return;
    }

    const commonData = { amount: payoutAmount, date, paidTo, description };

    if (mode === "edit" && onSave && initialData) {
      onSave({ ...initialData, ...commonData });
    } else if (mode === "add" && onAddDonationPayout) {
      onAddDonationPayout(commonData);
      setAmount("");
      setPaidTo("");
      setDescription("");
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      {!isEditMode && (
        <div className="p-4 mb-4 bg-wise-green-light border-l-4 border-wise-green">
          <h3 className="font-bold text-wise-green-dark">Available Fund</h3>
          <p className="text-2xl font-bold text-wise-blue">
            {formatCurrency(availableFunds)}
          </p>
        </div>
      )}
      <h2 className="text-lg font-semibold text-wise-blue mb-4">
        {isEditMode ? "Edit Payout" : "Record Donation Payout"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="don-date"
              className="block mb-1.5 text-sm font-semibold text-slate-600"
            >
              Date
            </label>
            <input
              type="date"
              id="don-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="don-amount"
              className="block mb-1.5 text-sm font-semibold text-slate-600"
            >
              Amount (PKR)
            </label>
            <input
              type="number"
              id="don-amount"
              placeholder="e.g., 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="don-paidTo"
            className="block mb-1.5 text-sm font-semibold text-slate-600"
          >
            Paid To (Organization/Cause)
          </label>
          <input
            type="text"
            id="don-paidTo"
            placeholder="e.g., Edhi Foundation"
            value={paidTo}
            onChange={(e) => setPaidTo(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="don-desc"
            className="block mb-1.5 text-sm font-semibold text-slate-600"
          >
            Description (Optional)
          </label>
          <input
            type="text"
            id="don-desc"
            placeholder="e.g., Monthly contribution"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 flex items-center justify-center gap-2 bg-wise-green text-white font-bold rounded-lg hover:bg-wise-green-dark"
        >
          {isEditMode ? (
            <>
              <Save size={20} /> Save Changes
            </>
          ) : (
            <>
              <PlusCircle size={20} /> Record Payout
            </>
          )}
        </button>
      </form>
    </div>
  );
};
