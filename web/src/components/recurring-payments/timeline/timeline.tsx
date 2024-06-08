import Block from "@/components/ui/block";
import { ScrollShadow } from "@nextui-org/react";
import Month from "./month";

const paymentsTest: Record<string, RecurringPayment[]> = {
  Maj: [
    {
      id: "febc139d-0e67-405d-8213-3f47088b13bf",
      next_payment_date: "2024-05-21",
      interval_days: 7,
      title: "test",
      amount: 10,
      currency: "PLN",
      type: "expense",
    },
    {
      id: "dbe675c2-839b-4281-bd86-d6e0ab584cc0",
      next_payment_date: "2024-05-12",
      interval_days: 7,
      title: "testusd",
      amount: 15,
      currency: "USD",
      type: "income",
    },
  ],
  Kwiecień: [
    {
      id: "febc139d-0e67-405d-8213-3f47088b13bf",
      next_payment_date: "2024-04-22",
      interval_days: 7,
      title: "test",
      amount: 10,
      currency: "PLN",
      type: "expense",
    },
    {
      id: "dbe675c2-839b-4281-bd86-d6e0ab584cc0",
      next_payment_date: "2024-04-21",
      interval_days: 7,
      title: "testusd",
      amount: 15,
      currency: "USD",
      type: "income",
    },
  ],
  Marzec: [
    {
      id: "febc139d-0e67-405d-8213-3f47088b13bf",
      next_payment_date: "2024-03-22",
      interval_days: 7,
      title: "test",
      amount: 10,
      currency: "PLN",
      type: "expense",
    },
    {
      id: "dbe675c2-839b-4281-bd86-d6e0ab584cc0",
      next_payment_date: "2024-03-21",
      interval_days: 7,
      title: "testusd",
      amount: 15,
      currency: "USD",
      type: "income",
    },
  ],
  Luty: [
    {
      id: "febc139d-0e67-405d-8213-3f47088b13bf",
      next_payment_date: "2024-02-22",
      interval_days: 7,
      title: "test",
      amount: 10,
      currency: "PLN",
      type: "expense",
    },
    {
      id: "dbe675c2-839b-4281-bd86-d6e0ab584cc0",
      next_payment_date: "2024-02-21",
      interval_days: 7,
      title: "testusd",
      amount: 15,
      currency: "USD",
      type: "income",
    },
  ],
};

const paymentsTest2: RecurringPayment[] = [
  {
    id: "febc139d-0e67-405d-8213-3f47088b13bf",
    next_payment_date: "2024-03-22",
    interval_days: 7,
    title: "test",
    amount: 10,
    currency: "PLN",
    type: "income",
  },
  {
    id: "febc139d-0e67-405d-8213-3f47088b13bf",
    next_payment_date: "2024-03-22",
    interval_days: 7,
    title: "test",
    amount: 10,
    currency: "PLN",
    type: "expense",
  },
  {
    id: "febc139d-0e67-405d-8213-3f47088b13bf",
    next_payment_date: "2024-03-22",
    interval_days: 7,
    title: "test",
    amount: 10,
    currency: "USD",
    type: "expense",
  },

  {
    id: "febc139d-0e67-405d-8213-3f47088b13bf",
    next_payment_date: "2024-03-22",
    interval_days: 7,
    title: "test",
    amount: 10,
    currency: "EUR",
    type: "expense",
  },
];

export default function Timeline() {
  return (
    <Block title="Oś czasu">
      <ScrollShadow className="max-h-[calc(100vh-262px)]" hideScrollBar>
        <div className="flex flex-col">
          {Object.keys(paymentsTest).map((month) => (
            <Month key={month} month={month} payments={paymentsTest[month]} />
          ))}
        </div>
      </ScrollShadow>
    </Block>
  );
}
