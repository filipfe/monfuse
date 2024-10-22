type TimelinePayment = {
  id: string;
  title: string;
  amount: number;
  currency: string;
};

type RecurringPayment = TimelinePayment & {
  type: "income" | "expense";
  last_payment: string;
  next_payment: string;
};

type TimelineEntry = {
  date: string;
  incomes: TimelinePayment[];
  expenses: TimelinePayment[];
};

interface UpcomingRecurringPayment extends Payment {
  payment_date: string;
  interval_amount: number;
  interval_unit: string;
}

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
