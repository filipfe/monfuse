import Link from "next/link";
import Block from "../ui/block";
import { CheckCircle, PlusIcon } from "lucide-react";
import HorizontalScroll from "../ui/horizontal-scroll";
import GoalRef from "./ref";
import { Dict } from "@/const/dict";
import Empty from "../ui/empty";
import { Button } from "../ui/button";

interface Props extends Pick<Settings, "language"> {
  dict: Dict["private"]["goals"]["list"];
  goals: Goal[];
}

export default async function GoalsList({ dict, language, goals }: Props) {
  return (
    <Block
      title={dict.title}
      cta={
        goals.length > 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/goals/add">
              <PlusIcon size={14} />
              {dict.button}
            </Link>
          </Button>
        )
      }
    >
      {goals.length > 0 ? (
        <HorizontalScroll innerClassName="items-end">
          {goals.map((item) => (
            <GoalRef
              language={language}
              dict={dict.goal}
              goal={item}
              key={item.id}
            />
          ))}
        </HorizontalScroll>
      ) : (
        <Empty
          title={dict._empty}
          cta={{ title: dict.button, href: "/goals/add" }}
          icon={CheckCircle}
        />
      )}
    </Block>
  );
}
