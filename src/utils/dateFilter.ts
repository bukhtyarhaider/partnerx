import type {
  DateFilterType,
  DateFilterValue,
  DateRange,
} from "../components/DateFilter";

// Helper function to get the default filter (current month)
export const getDefaultDateFilter = (): DateFilterValue => {
  const now = new Date();
  return {
    type: "current-month",
    range: {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    },
  };
};

// Helper function to check if a date string falls within a date range
export const isDateInRange = (dateStr: string, range: DateRange): boolean => {
  if (!range.startDate && !range.endDate) {
    return true; // All time filter
  }

  const date = new Date(dateStr);

  if (range.startDate && date < range.startDate) {
    return false;
  }

  if (range.endDate && date > range.endDate) {
    return false;
  }

  return true;
};

// Helper function to get current date range for a filter type
export const getCurrentDateRange = (type: DateFilterType): DateRange => {
  const now = new Date();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  switch (type) {
    case "current-month":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      };
    case "3-months":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1), // 2 months ago + current month = 3 months
        endDate: endOfToday,
      };
    case "6-months":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 5, 1), // 5 months ago + current month = 6 months
        endDate: endOfToday,
      };
    case "1-year":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 11, 1), // 11 months ago + current month = 12 months
        endDate: endOfToday,
      };
    case "all-time":
      return {
        startDate: null,
        endDate: null,
      };
    default:
      return { startDate: null, endDate: null };
  }
};
