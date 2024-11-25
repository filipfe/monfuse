import Block from "../../ui/block";
import Empty from "../../ui/empty";
import { Dict } from "@/const/dict";
import Priority from "./priority";
import { getPriorityGoal } from "@/lib/goals/actions";

interface Props extends Pick<Settings, "language"> {
  dict: Dict["private"]["goals"]["priority"];
}

export default async function GoalPriority({ dict, language }: Props) {
  const { result: goal } = await getPriorityGoal();

  return (
    <Block className="max-md:!pt-12">
      {goal ? (
        <Priority language={language} dict={dict} goal={goal} />
      ) : (
        <Empty title={dict._empty} />
      )}
    </Block>
  );
}
