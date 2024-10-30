import Link from "next/link";
import Block from "../ui/block";
import { Button } from "@nextui-org/react";
import { CheckCircle, PlusIcon } from "lucide-react";
import HorizontalScroll from "../ui/horizontal-scroll";
import GoalRef from "./ref";
import { Dict } from "@/const/dict";
import Empty from "../ui/empty";

export default async function GoalsList({
  dict,
  goals,
}: {
  dict: Dict["private"]["goals"]["list"];
  goals: Goal[];
}) {
  return (
    <Block
      title={dict.title}
      cta={
        goals.length > 0 && (
          <Link href="/goals/add">
            <Button
              as="div"
              variant="light"
              disableRipple
              startContent={<PlusIcon size={14} />}
              className="h-8 bg-light border"
              size="sm"
              radius="md"
            >
              {dict.button}
            </Button>
          </Link>
        )
      }
    >
      {goals.length > 0 ? (
        <HorizontalScroll innerClassName="items-end">
          {goals.map((item) => (
            <GoalRef dict={dict.goal} goal={item} key={item.id} />
          ))}
        </HorizontalScroll>
      ) : (
        <Empty
          title="Brak aktywnych celów"
          cta={{ title: "Dodaj cel", href: "/goals/add" }}
          icon={CheckCircle}
        />
      )}
    </Block>
  );
}
