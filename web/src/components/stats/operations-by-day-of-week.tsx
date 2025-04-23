"use client";

import { useContext } from "react";
import Block from "../ui/block";
import Empty from "../ui/empty";
import { StatsFilterContext } from "@/app/(private)/(sidebar)/stats/providers";
import { useOperationsByDayOfWeek } from "@/lib/stats/queries";
import LineChartLoader from "../ui/charts/line-loader";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Dict } from "@/const/dict";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

export default function OperationsByDayOfWeek({
  dict,
}: {
  dict: {
    general: {
      incomes: Dict["private"]["general"]["incomes"];
      expenses: Dict["private"]["general"]["expenses"];
    };
  } & Dict["private"]["stats"]["operations-by-day-of-week"];
}) {
  const { month, year, currency, settings } = useContext(StatsFilterContext);
  const { isLoading, data: results } = useOperationsByDayOfWeek(
    settings.timezone,
    currency,
    month + 1,
    year
  );

  const formatter = new Intl.DateTimeFormat(settings.language, {
    weekday: "short",
  });

  const maxIncomes = results
    ? Math.max(...results.map((item) => item.total_incomes), 0)
    : 0;
  const maxExpenses = results
    ? Math.max(...results.map((item) => item.total_expenses), 0)
    : 0;

  return (
    <Block className="col-span-2 " title={dict.title}>
      <div className="flex flex-col sm:grid grid-cols-2 flex-1 w-full">
        <ChartContainer
          config={
            {
              total_incomes: {
                label: dict.general.incomes,
              },
            } satisfies ChartConfig
          }
          className="w-full aspect-square"
        >
          <RadarChart outerRadius="80%" data={results}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid />
            <PolarAngleAxis
              dataKey="day_of_week"
              tickFormatter={(dayNumber) => {
                const date = new Date(2023, 0, dayNumber + 1);
                return formatter.format(date);
              }}
            />
            <PolarRadiusAxis
              angle={65}
              domain={[-1, maxIncomes > 0 ? "auto" : 3]}
              tick={false}
              axisLine={false}
            />
            <Radar
              isAnimationActive={false}
              name={dict.general.incomes}
              dataKey="total_incomes"
              stroke="#177981"
              fill="#177981"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <ChartLegend
              content={<ChartLegendContent className="text-primary" />}
            />
          </RadarChart>
        </ChartContainer>
        <ChartContainer
          config={
            {
              total_expenses: {
                label: dict.general.expenses,
              },
            } satisfies ChartConfig
          }
          className="w-full aspect-square"
        >
          <RadarChart outerRadius="80%" data={results}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid />
            <PolarAngleAxis
              dataKey="day_of_week"
              tickFormatter={(dayNumber) =>
                formatter.format(new Date(2023, 0, dayNumber + 1))
              }
            />
            <PolarRadiusAxis
              angle={65}
              domain={[-1, maxExpenses > 0 ? "auto" : 3]}
              tick={false}
              axisLine={false}
            />
            <Radar
              isAnimationActive={false}
              name={dict.general.expenses}
              dataKey="total_expenses"
              stroke="#fdbb2d"
              fill="#fdbb2d"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <ChartLegend
              content={<ChartLegendContent className="text-secondary" />}
            />
          </RadarChart>
        </ChartContainer>
      </div>
    </Block>
  );
}
