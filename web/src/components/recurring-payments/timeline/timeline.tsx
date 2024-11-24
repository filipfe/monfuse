import Block from "@/components/ui/block";
import Ref from "./ref";
import { getTimeline } from "@/lib/recurring-payments/actions";

export default async function Timeline({ timezone }: { timezone: string }) {
  const { results } = await getTimeline(timezone);
  return (
    <Block className="col-span-2" title="Timeline">
      <div className="flex justify-between items-end h-[127px]">
        {results.map(({ date, incomes, expenses }, index) => (
          <Ref
            key={date}
            date={date}
            isToday={index === 7}
            incomes={incomes}
            expenses={expenses}
          />
        ))}
      </div>
    </Block>
  );
}
