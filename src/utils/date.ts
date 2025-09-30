// Helper to get today's date in YYYY-MM-DD format
export const getTodayString = () =>
  new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
