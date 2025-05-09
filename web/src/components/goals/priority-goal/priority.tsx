import { ScrollShadow } from "@heroui/react";
import NumberFormat from "@/utils/formatters/currency";
import { Dict } from "@/const/dict";
import { PaymentRef } from "./ref";
import { Progress } from "@/components/ui/progress";

interface Props extends Pick<Settings, "language"> {
  dict: Dict["private"]["goals"]["priority"];
  goal: PriorityGoal;
}

export default async function Priority({ dict, goal, language }: Props) {
  const percentage = (goal.total_paid / goal.price) * 100;

  return (
    <div className="flex flex-col h-full gap-6">
      {/* <h3 className="text-3xl font-bold text-center">{goal.title}</h3> */}
      <div className="grid gap-3">
        <div className="flex items-start gap-4 justify-between relative pt-8">
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-full h-2.5 w-2.5" />
              <span className="text-sm">{dict.collected}</span>
            </div>
            <div className="flex-col flex md:flex-row md:items-center md:gap-2">
              <span className="font-bold">
                <NumberFormat
                  currency={goal.currency}
                  amount={goal.total_paid}
                />
              </span>
              <span className="text-font/80">{`(${percentage.toFixed(
                2
              )}%)`}</span>
            </div>
          </div>
          <div className="absolute -top-6 md:-top-1.5 left-1/2 -translate-x-1/2 text-center w-full flex flex-col items-center">
            <h2 className="text-font/80">{dict.title}</h2>
            <h3 className="font-bold text-lg leading-tight whitespace-nowrap max-w-full text-ellipsis overflow-hidden">
              {goal.title}
            </h3>
          </div>
          <div className="flex items-end flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="bg-light border rounded-full h-2.5 w-2.5" />
              <span className="text-sm">{dict.remaining}</span>
            </div>
            <div className="flex-col items-end flex md:flex-row md:items-center md:gap-2">
              <span className="font-bold">
                <NumberFormat
                  currency={goal.currency}
                  amount={goal.price - goal.total_paid}
                />
              </span>
              <span className="text-font/80">{`(${(100 - percentage).toFixed(
                2
              )}%)`}</span>
            </div>
          </div>
        </div>
        <Progress
          className="border bg-light h-3"
          value={percentage}
          // valueLabel={percentage.toFixed(2) + "%"}
          // showValueLabel
          // label="Zebrano"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 pb-2">
          <span className="text-sm font-medium uppercase">
            {dict.payments.date}
          </span>
          <span className="text-sm font-bold">{dict.payments.title}</span>
          <span className="text-sm font-medium uppercase">
            {dict.payments.amount}
          </span>
        </div>
        <div className="flex-1 relative min-h-48">
          <div className="absolute inset-0 w-full h-full">
            <ScrollShadow className="h-full" hideScrollBar>
              <ul>
                {goal.payments.map((payment) => (
                  <PaymentRef
                    {...payment}
                    language={language}
                    currency={goal.currency}
                    key={payment.date}
                  />
                ))}
              </ul>
            </ScrollShadow>
          </div>
        </div>
      </div>
    </div>
  );
}
