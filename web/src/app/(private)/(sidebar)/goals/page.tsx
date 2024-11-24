import Table from "@/components/goals/table";
import List from "@/components/goals/list";
import { getSettings } from "@/lib/general/actions";
import getDictionary from "@/const/dict";
import GoalPriority from "@/components/goals/priority-goal/goal-priority";
import { getCurrentGoals, getGoalsPayments } from "@/lib/goals/actions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const {
    private: {
      goals: { _metadata },
    },
  } = await getDictionary(settings.language);
  return _metadata;
}

export default async function Page() {
  const settings = await getSettings();
  const { results: goals } = await getCurrentGoals();
  const { results: tableData } = await getGoalsPayments(settings.timezone);
  const {
    private: { goals: dict },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2 grid-rows-[max-content_1fr]">
      <List dict={dict.list} goals={goals} />
      <Table
        goals={goals}
        tableData={tableData}
        language={settings.language}
        dict={{
          ...dict.payments,
          button: dict.list.button,
          _empty: dict.list._empty,
        }}
      />
      <GoalPriority goals={goals} dict={dict.priority} />
    </div>
  );
}
