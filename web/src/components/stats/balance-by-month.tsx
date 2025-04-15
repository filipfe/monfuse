"use client";

import Block from "@/components/ui/block";
import Empty from "@/components/ui/empty";
import { ReactNode, useContext } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import { StatsFilterContext } from "@/app/(private)/(sidebar)/stats/providers";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { useBalanceHistory } from "@/lib/stats/queries";
import ChartLoader from "../ui/charts/loader";
import NumberFormat from "@/utils/formatters/currency";
import { Dict } from "@/const/dict";
import { ChartConfig, ChartContainer } from "../ui/chart";

const CustomTooltip = ({
  dict,
  active,
  payload,
  labelFormatter,
  currency,
}: TooltipProps<ValueType, NameType> & {
  dict: {
    incomes: Dict["private"]["general"]["incomes"];
    expenses: Dict["private"]["general"]["expenses"];
  };
  labelFormatter: (
    label: any,
    payload: Payload<ValueType, NameType>[]
  ) => ReactNode;
  currency: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-white text-font border-font/10 border min-w-44 shadow-lg shadow-font/5">
        <div className="py-2 px-4 border-b border-font/10">
          <p className="text-sm">
            {labelFormatter(payload[0].payload.date, payload[0].payload)}
          </p>
        </div>
        {payload.map((record, k) => (
          <PayloadRef
            {...record}
            dict={dict}
            currency={currency}
            index={k}
            key={`payload-${k}`}
          />
        ))}
      </div>
    );
  }

  return null;
};

interface PayloadProps extends Payload<ValueType, NameType> {
  dict: Props["dict"]["general"];
  index: number;
  currency: string;
}

const PayloadRef = ({
  color,
  dataKey,
  value,
  dict,
  index,
  currency,
}: PayloadProps) => (
  <div className="py-2 px-4 flex items-center justify-between gap-6">
    <div className="flex items-center gap-2">
      {color && (
        <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center shadow">
          <div
            style={{
              backgroundColor: color,
              opacity: index === 0 ? 1 : 0.5,
            }}
            className="w-2 h-2 rounded-full"
          />
        </div>
      )}
      <span className="text-sm">
        {dataKey === "total_expenses" ? dict.expenses : dict.incomes}
      </span>
    </div>
    <strong className="font-medium text-sm">
      <NumberFormat
        currency={currency}
        amount={value ? parseFloat(value.toString()) : 0}
      />
    </strong>
  </div>
);

type Props = {
  dict: {
    general: {
      incomes: Dict["private"]["general"]["incomes"];
      expenses: Dict["private"]["general"]["expenses"];
    };
  } & Dict["private"]["stats"]["balance-by-month"];
};

export default function BalanceByMonth({ dict }: Props) {
  const { month, year, currency, settings } = useContext(StatsFilterContext);
  const { data: results, isLoading } = useBalanceHistory(
    settings.timezone,
    currency,
    month + 1,
    year
  );
  const { width, tickFormatter } = useYAxisWidth(currency, settings.language);

  const maxValue = results
    ? Math.max(
        ...results.map((item) => Math.abs(item.total_expenses)),
        ...results.map((item) => Math.abs(item.total_incomes))
      )
    : 0;

  const buffer = Math.ceil(maxValue * 0.1);
  const yAxisMaxValue = maxValue + buffer;

  const ticks = [
    -yAxisMaxValue,
    -yAxisMaxValue / 2,
    0,
    yAxisMaxValue / 2,
    yAxisMaxValue,
  ];

  return (
    <Block
      className="xl:row-start-1 xl:row-end-4 col-start-1 col-end-3 xl:col-start-3 xl:col-end-5"
      title={dict.title}
    >
      {isLoading ? (
        <ChartLoader className="!p-0" hideTitle />
      ) : maxValue !== 0 ? (
        <div className="flex-1 grid">
          <ChartContainer
            config={{} satisfies ChartConfig}
            style={{ minHeight: 240 }}
            className="h-full w-full"
          >
            <BarChart data={results} stackOffset="sign" reverseStackOrder>
              {/* <CartesianGrid vertical={false} opacity={0.5} /> */}
              <YAxis
                // width={width}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={tickFormatter}
                domain={[-yAxisMaxValue, yAxisMaxValue]}
                ticks={ticks}
              />
              <XAxis
                tickMargin={8}
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(label) => {
                  const [year, month, day] = label.split("-");
                  return new Intl.DateTimeFormat(settings.language, {
                    day: "2-digit",
                    month: "short",
                  }).format(new Date(year, parseInt(month) - 1, day));
                }}
                minTickGap={32}
                axisLine={false}
                tickLine={false}
                type="category"
              />
              <CartesianGrid
                // opacity={0.6}
                // strokeWidth={1}
                vertical={false}
                // className="stroke-neutral-500"
              />
              <ReferenceLine y={0} stroke="#737373" opacity={0.5} />
              <Tooltip
                cursor={{ fill: "#177981", fillOpacity: 0.1 }}
                isAnimationActive={false}
                content={(props) => (
                  <CustomTooltip
                    {...props}
                    dict={dict.general}
                    labelFormatter={(label) =>
                      new Intl.DateTimeFormat(settings.language, {
                        dateStyle: "full",
                      }).format(new Date(label))
                    }
                    currency={currency}
                  />
                )}
              />
              <Bar dataKey="total_expenses" stackId="a" fill="#fdbb2d" />
              <Bar dataKey="total_incomes" stackId="a" fill="#177981" />
            </BarChart>
          </ChartContainer>
        </div>
      ) : (
        <Empty title={dict._empty} />
      )}
    </Block>
  );
}
