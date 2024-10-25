type TimelinePayment = {
  id: string;
  title: string;
  amount: number;
  currency: string;
};

type RecurringPayment = TimelinePayment & {
  type: "income" | "expense";
  interval_amount: number;
  interval_unit: "day" | "week" | "month" | "year";
  last_payment: string;
  next_payment: string;
};

type TimelineEntry = {
  date: string;
  incomes: TimelinePayment[];
  expenses: TimelinePayment[];
};

type UpcomingPayment = TimelinePayment & {
  payment_datetime: string;
  type: "income" | "expense";
};
