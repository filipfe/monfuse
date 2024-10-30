import Block from "../../ui/block";
import Empty from "../../ui/empty";
import { Dict } from "@/const/dict";
import Priority from "./priority";
import { getPriorityGoal } from "@/lib/goals/actions";
import { Select, SelectItem } from "@nextui-org/react";

type Props = {
  dict: Dict["private"]["goals"]["priority"];
  goals: Goal[];
};

export default async function GoalPriority({ dict, goals }: Props) {
  const { result: goal } = await getPriorityGoal();

  return (
    <Block className="max-md:!pt-12">
      {goal ? (
        <Priority dict={dict} goal={goal} />
      ) : (
        // <div className="flex-1 flex flex-col justify-center gap-4 items-center">
        //   <h4 className="text-sm">Ustaw priorytet</h4>
        //   <Select
        //     placeholder="Wybierz cel"
        //     label="Priorytet"
        //     className="w-full max-w-xs"
        //     isDisabled={goals.length === 0}
        //     classNames={{ trigger: "bg-light shadow-none border" }}
        //   >
        //     {goals.map((goal) => (
        //       <SelectItem key={goal.id}>{goal.title}</SelectItem>
        //     ))}
        //   </Select>
        // </div>
        <Empty title={dict._empty} />
      )}
    </Block>
  );
}
