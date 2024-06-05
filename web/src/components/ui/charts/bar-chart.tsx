"use client";

import numberFormat from "@/utils/formatters/currency";
import {
  ResponsiveContainer,
  BarChart as BarChartWrapper,
  Bar,
  CartesianGrid,
  YAxis,
  XAxis,
  Cell,
  Tooltip,
} from "recharts";

type Props = {
  data: ChartLabel[];
  currency: string;
};

const renderCustomBarLabel = ({
  payload: _payload,
  x,
  y,
  width,
  height: _height,
  value,
  currency,
}: any) => {
  return (
    <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>
      {numberFormat(currency, value)}
    </text>
  );
};

export default function BarChart({ data, currency }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartWrapper
        data={data}
        margin={{ top: 10, left: 8, right: 36, bottom: 0 }}
      >
        <CartesianGrid vertical={false} opacity={0.5} />
        <YAxis
          tick={{ fontSize: 12 }}
          dataKey="total_amount"
          tickFormatter={(value) => numberFormat(currency, value, "compact")}
          axisLine={false}
          tickLine={false}
        />
        <XAxis
          interval={0}
          dataKey="name"
          tick={{ fontSize: 14 }}
          axisLine={false}
          tickLine={false}
        />
        <Bar
          maxBarSize={120}
          dataKey="total_amount"
          radius={[24, 24, 0, 0]}
          label={(e) => renderCustomBarLabel({ ...e, currency })}
        >
          {data.map((item, k) => (
            <Cell fill={k % 2 === 0 ? "#177981" : "#ffc000"} key={item.name} />
          ))}
        </Bar>
      </BarChartWrapper>
    </ResponsiveContainer>
  );
}
