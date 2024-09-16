"use client";

import Block from "@/components/ui/block";
import ChartLoader from "@/components/ui/charts/loader";
import Empty from "@/components/ui/empty";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "../ui/charts/tooltip";
import { useExpensesByLabel } from "@/lib/operations/queries";

const colors = ["#177981", "#fdbb2d", "#448dc9", "#fb923c"];

export default function ExpensesByLabelChart({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const [currency, setCurrency] = useState<string>(defaultCurrency);
  const { width, tickFormatter } = useYAxisWidth(currency);
  const { isLoading, data: results } = useExpensesByLabel(currency);
  return (
    <Block
      className="xl:col-span-3"
      title="Wydatki wg Etykiety"
      cta={
        <UniversalSelect
          className="w-20"
          name="currency"
          size="sm"
          radius="md"
          aria-label="Waluta"
          defaultSelectedKeys={[currency]}
          elements={CURRENCIES}
          onChange={(e) => setCurrency(e.target.value)}
        />
      }
    >
      <div className="h-96 flex flex-col">
        {isLoading ? (
          <ChartLoader className="!p-0" hideTitle />
        ) : results && results.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={results}
              margin={{ top: 16, left: 8, right: 36, bottom: 0 }}
            >
              <CartesianGrid vertical={false} opacity={0.5} />
              <YAxis
                width={width}
                tick={{ fontSize: 12 }}
                dataKey="total_amount"
                axisLine={false}
                tickLine={false}
                tickFormatter={tickFormatter}
              />
              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 14,
                }}
                tickSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Bar
                maxBarSize={120}
                dataKey="total_amount"
                radius={[24, 24, 0, 0]}
              >
                {results.map((item, k) => (
                  <Cell
                    className="transition-opacity opacity-100 hover:opacity-80"
                    fill={colors[k]}
                    key={item.name}
                  />
                ))}
              </Bar>
              <Tooltip
                isAnimationActive={false}
                shared={false}
                content={(props) => (
                  <ChartTooltip
                    {...props}
                    payloadName="Wydatki"
                    currency={currency}
                    label={undefined}
                  />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty
            title="Brak wydatków z etykietą!"
            cta={{ title: "Dodaj wydatek", href: "/expenses/add" }}
          />
        )}
      </div>
    </Block>
  );
}
