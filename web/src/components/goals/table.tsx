"use client";

import {
  Button,
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from "@heroui/react";
import Block from "../ui/block";
import { useEffect, useRef, useState } from "react";
import { CheckCircle, ChevronDown } from "lucide-react";
import PaymentPopover from "./popover";
import NumberFormat from "@/utils/formatters/currency";
import Empty from "../ui/empty";
import { Dict } from "@/const/dict";

export default function GoalsTable({
  goals,
  tableData,
  language,
  dict,
}: {
  goals: Goal[];
  tableData: GoalPayment[];
  language: Lang;
  dict: Dict["private"]["goals"]["payments"] &
    Pick<Dict["private"]["goals"]["list"], "button" | "_empty">;
}) {
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const tbodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tbodyRef.current) return;
    tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;
  }, [goals]);

  useEffect(() => {
    if (!tbodyRef.current) return;

    setScrollButtonVisible(
      tbodyRef.current.scrollTop + tbodyRef.current.clientHeight <
        tbodyRef.current.scrollHeight - 1
    );

    const onScroll = (_e: Event) => {
      if (!tbodyRef.current) return;

      setScrollButtonVisible(
        tbodyRef.current.scrollTop + tbodyRef.current.clientHeight <
          tbodyRef.current.scrollHeight - 65
      );
    };

    tbodyRef.current.addEventListener("scroll", onScroll);

    return () => {
      tbodyRef.current &&
        tbodyRef.current.removeEventListener("scroll", onScroll);
    };
  }, [tbodyRef.current]);

  return (
    <Block title={dict.title} className="row-span-2">
      {goals.length > 0 ? (
        <div className="flex-1 relative min-h-80">
          <div className="absolute inset-0 w-full h-full">
            <ScrollShadow
              orientation="horizontal"
              hideScrollBar
              className="relative h-full"
            >
              {scrollButtonVisible && (
                <div className="absolute bottom-24 left-[calc(50%-41px)] z-20">
                  <Button
                    size="sm"
                    radius="md"
                    disableRipple
                    variant="shadow"
                    className="fixed border"
                    onClick={() => {
                      tbodyRef.current?.scrollTo({
                        top: tbodyRef.current.scrollHeight,
                        behavior: "smooth",
                      });
                    }}
                  >
                    <ChevronDown size={16} /> {dict.today}
                  </Button>
                </div>
              )}
              <Table
                color="primary"
                aria-label="Goals table"
                radius="md"
                isHeaderSticky
                removeWrapper
                classNames={{
                  base: "h-full scrollbar-hide py-px px-px overflow-y-scroll overflow-x-hidden min-w-max relative",
                  table: "min-h-[400px]",
                  thead: "[&>tr]:first:!shadow-none",
                }}
                baseRef={tbodyRef}
                shadow="none"
              >
                <TableHeader>
                  <TableColumn className="font-medium text-sm text-foreground-700 shadow-[0_0_0_1px_rgba(23,121,129,0.1)]">
                    {dict.columns.date}
                  </TableColumn>
                  {goals.length > 0 &&
                    (goals.map((goal) => (
                      <TableColumn
                        minWidth={288}
                        align="center"
                        className="font-medium text-sm text-foreground-700 shadow-[0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:shadow-[1px_0_0_0_rgba(23,121,129,0.1),0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)]"
                        key={goal.id}
                      >
                        {goal.title}
                      </TableColumn>
                    )) as any)}
                </TableHeader>
                <TableBody className="py-px">
                  {
                    tableData.map(({ date, payments }) => {
                      const isToday =
                        tableData[tableData.length - 1].date === date;
                      return (
                        <TableRow
                          className={cn(!isToday && "hover:bg-light")}
                          key={date}
                        >
                          <TableCell
                            className={cn(
                              "min-w-max",
                              isToday ? "font-medium" : "font-normal"
                            )}
                          >
                            {isToday
                              ? dict.today
                              : new Intl.DateTimeFormat(language, {
                                  dateStyle: "long",
                                }).format(new Date(date))}
                          </TableCell>
                          {
                            goals.map((goal) => {
                              const payment = payments.find(
                                (p) => p.goal_id === goal.id
                              )!;

                              return (
                                <TableCell key={goal.id}>
                                  {isToday ? (
                                    <PaymentPopover
                                      dict={dict.form}
                                      goal={goal}
                                      paid={payment.amount}
                                    />
                                  ) : (
                                    <NumberFormat
                                      currency={goal.currency}
                                      amount={payment.amount}
                                    />
                                  )}
                                </TableCell>
                              );
                            }) as any
                          }
                        </TableRow>
                      );
                    }) as any
                  }
                  <TableRow
                    className="sticky z-10"
                    style={{ insetBlockEnd: 0 }}
                  >
                    <TableCell className="text-sm font-medium rounded-l-md shadow-[0_0_0_1px_rgba(23,121,129,0.1)] bg-light">
                      {dict.sum}
                    </TableCell>
                    {
                      goals.map((goal) => (
                        <TableCell className="text-foreground-700 bg-light shadow-[0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:shadow-[1px_0_0_0_rgba(23,121,129,0.1),0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:rounded-r-md">
                          <span className="font-semibold text-sm">
                            <NumberFormat
                              currency={goal.currency}
                              amount={goal.total_paid}
                              language_code={language}
                            />
                          </span>{" "}
                          <span className="font-medium text-tiny">
                            /{" "}
                            <NumberFormat
                              currency={goal.currency}
                              language_code={language}
                              amount={goal.price}
                            />
                          </span>
                        </TableCell>
                      )) as any
                    }
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollShadow>
          </div>
        </div>
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
