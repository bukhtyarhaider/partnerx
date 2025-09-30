import type { Expense, Transaction } from "../types";
import type { Financials } from "../hooks/useFinancials";

export async function generateFinancialSummary({
  transactions,
  expenses,
  financials,
}: {
  transactions: Transaction[];
  expenses: Expense[];
  financials: Financials;
}): Promise<string> {
  const systemPrompt =
    "You are a helpful financial assistant. Analyze the provided financial data and generate a concise, insightful summary in 3-4 bullet points. Focus on key metrics like profitability, spending habits, and overall financial health. Use markdown for formatting (e.g., **bold** headers).";

  const userQuery = `
    Here is the financial data for the period:
    - Total Gross Profit: ${financials.totalGrossProfit}
    - Total Net Profit: ${financials.totalNetProfit}
    - Total Expenses: ${financials.totalExpenses}
    - Company Capital: ${financials.companyCapital}

    - All Transactions: ${JSON.stringify(transactions, null, 2)}
    - All Expenses: ${JSON.stringify(expenses, null, 2)}

    Please provide a summary.
  `;

  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API key is not set.");

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("No summary was generated.");

  return text;
}
