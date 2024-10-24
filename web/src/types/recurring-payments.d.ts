type TimelinePayment = {
  id: string;
  title: string;
  amount: number;
  currency: string;
};

type RecurringPayment = TimelinePayment & {
  type: "income" | "expense";
  interval_amount: number;
  interval_amount: "day" | "week" | "month" | "year";
  last_payment: string;
  next_payment: string;
};

type TimelineEntry = {
  date: string;
  incomes: TimelinePayment[];
  expenses: TimelinePayment[];
};

type UpcomingPayment = {
  payment_date: string;
  payments: Array<TimelinePayment & { type: "income" | "expense" }>;
};

type Year = {
  year: number;
  months: Month[];
};

type TotalAmount = {
  [currency: string]: number;
};

type Month = {
  month: number;
  payments: Payment[];
};
