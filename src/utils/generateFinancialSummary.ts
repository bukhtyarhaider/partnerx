import type { Expense, Transaction } from "../types";
import type { Financials } from "../hooks/useFinancials";
import type { DateFilterValue } from "../components/DateFilter";

export async function generateFinancialSummary({
  transactions,
  expenses,
  financials,
  dateFilter,
}: {
  transactions: Transaction[];
  expenses: Expense[];
  financials: Financials;
  dateFilter: DateFilterValue;
}): Promise<string> {
  // Helper function to format date range
  const formatDateRange = (filter: DateFilterValue): string => {
    if (filter.type === "all-time") {
      return "All Time";
    }

    if (
      filter.type === "custom" &&
      filter.range.startDate &&
      filter.range.endDate
    ) {
      return `${filter.range.startDate.toLocaleDateString()} - ${filter.range.endDate.toLocaleDateString()}`;
    }

    // Default ranges
    const dateLabels = {
      "current-month": "Current Month",
      "3-months": "Last 3 Months",
      "6-months": "Last 6 Months",
      "1-year": "Last 12 Months",
    };

    return (
      dateLabels[filter.type as keyof typeof dateLabels] || "Selected Period"
    );
  };

  // Helper function to format currency amounts
  const formatUSD = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPKR = (amount: number) => `₨${amount.toLocaleString()}`;

  const dateRangeText = formatDateRange(dateFilter);
  const systemPrompt =
    "You are an expert financial analyst and advisor. Analyze the provided financial data and generate a comprehensive, well-structured summary. Use the following format for optimal readability:\n\n" +
    `## Financial Overview for ${dateRangeText}\n` +
    "Provide a high-level assessment of financial health for the specified time period.\n\n" +
    "## Key Metrics Analysis\n" +
    "### Revenue & Profitability (USD)\n" +
    "- Highlight gross and net profit trends in USD currency\n" +
    "- Use specific dollar amounts and percentages\n\n" +
    "### Expense Management (PKR)\n" +
    "- Analyze spending patterns and efficiency in PKR currency\n" +
    "- Focus on cost optimization opportunities\n\n" +
    "## Insights & Recommendations\n" +
    "💡 Provide actionable insights using emoji prefixes:\n" +
    "✅ Positive trends and achievements\n" +
    "⚠️ Areas that need attention or improvement\n\n" +
    "IMPORTANT: Use **bold** for emphasis. Show income/revenue in USD ($) and expenses/donations in PKR (₨). Always include the time period context in your analysis. Keep the tone professional yet accessible.";

  const userQuery = `
    Please analyze my financial data for ${dateRangeText} and provide insights:

    ## Current Financial Position for ${dateRangeText}
    - **Total Gross Profit (USD)**: ${formatUSD(financials.totalGrossProfit)}
    - **Total Net Profit (USD)**: ${formatUSD(financials.totalNetProfit)}
    - **Total Expenses (PKR)**: ${formatPKR(financials.totalExpenses)}
    - **Company Capital (PKR)**: ${formatPKR(financials.companyCapital)}
    - **Profit Margin**: ${
      financials.totalGrossProfit > 0
        ? (
            (financials.totalNetProfit / financials.totalGrossProfit) *
            100
          ).toFixed(1)
        : 0
    }%

    ## Transaction Summary (USD Income)
    - **Total Transactions**: ${transactions.length}
    - **Recent Income Activity**: ${transactions
      .slice(-5)
      .map((t) => `${t.sourceId}: ${formatUSD(t.amountUSD)}`)
      .join(", ")}

    ## Expense Breakdown (PKR Spending)
    - **Total Expense Items**: ${expenses.length}
    - **Recent Expenses**: ${expenses
      .slice(-5)
      .map((e) => `${e.description}: ${formatPKR(e.amount)}`)
      .join(", ")}

    ## Raw Data for Deep Analysis (${dateRangeText})
    **Income Transactions (USD)**: ${JSON.stringify(
      transactions.slice(-10),
      null,
      2
    )}
    **Local Expenses (PKR)**: ${JSON.stringify(expenses.slice(-10), null, 2)}

    Please provide a comprehensive financial analysis following the structured format. Remember to clearly differentiate between USD income and PKR expenses, and focus on the ${dateRangeText} period.
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
