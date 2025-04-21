"use client";

import Block from "@/components/ui/block";
import Empty from "@/components/ui/empty";
import { useOperationsAmountsHistory } from "@/lib/operations/queries";
import { useRef, useState } from "react";
import { CURRENCIES } from "@/const";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import ChartLoader from "../ui/charts/loader";
import ChartTooltip from "../ui/charts/tooltip";
import { Dict } from "@/const/dict";
import { ChartContainer } from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  type: "income" | "expense";
  settings: Settings;
  title: string;
  dict: Dict["private"]["operations"]["operations-by-month"];
};

export default function OperationsByMonth({
  type,
  settings,
  title,
  dict,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currency, setCurrency] = useState<string>(settings.currency);
  const { data: results, isLoading } = useOperationsAmountsHistory(
    type,
    settings.timezone,
    currency
  );

  return (
    <Block
      className="xl:col-span-3 flex-1"
      title={title}
      cta={
        <Select value={currency} onValueChange={(value) => setCurrency(value)}>
          <SelectTrigger size="sm" className="w-20 col-span-2 row-start-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-20 min-w-0" align="end">
            {CURRENCIES.map((curr) => (
              <SelectItem value={curr} key={curr}>
                {curr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {isLoading ? (
        <ChartLoader className="!p-0" hideTitle />
      ) : results && results.length > 0 ? (
        <div className="flex-1 relative" style={{ minHeight: 240 }}>
          <div className="absolute inset-0 w-full h-full">
            <ChartContainer
              ref={containerRef}
              config={{}}
              className="w-full h-full"
            >
              <BarChart data={results}>
                {/* <CartesianGrid vertical={false} opacity={0.5} /> */}
                <YAxis
                  tick={{ fontSize: 12 }}
                  dataKey="total_amount"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat(settings.language, {
                      style: "currency",
                      currency,
                      notation: "compact",
                    }).format(value)
                  }
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
                      timeZone: settings.timezone,
                    }).format(new Date(year, parseInt(month) - 1, day));
                  }}
                  minTickGap={32}
                  axisLine={false}
                  tickLine={false}
                  type="category"
                />
                <CartesianGrid strokeWidth={1} vertical={false} />
                <Tooltip
                  cursor={{ fill: "#177981", fillOpacity: 0.1 }}
                  isAnimationActive={false}
                  labelFormatter={(label) => label}
                  content={(props) => (
                    <ChartTooltip
                      {...props}
                      payloadName={title}
                      currency={currency}
                      label={undefined}
                      labelFormatter={(label) =>
                        new Intl.DateTimeFormat(settings.language, {
                          dateStyle: "full",
                          timeZone: settings.timezone,
                        }).format(new Date(label))
                      }
                    />
                  )}
                />
                <Bar dataKey="total_amount" fill="#177981" />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      ) : (
        <Empty
          title={dict._empty.title}
          cta={{
            title: dict._empty.button[type],
            href: `/${type}s/add`,
          }}
        />
      )}
    </Block>
  );
}
