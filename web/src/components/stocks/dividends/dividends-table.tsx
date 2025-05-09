"use client";

import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { useSettings } from "@/lib/general/queries";
import { Spinner } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useCallback } from "react";

type Props = {
  dividends: Dividend[];
  holdings?: Holdings | null;
  simplified?: boolean;
};

type ColumnKey = keyof Dividend | "profit";

type TableDividend = Dividend & { profit?: string };

const columns = ({
  simplified,
  profitVisible,
}: Pick<Props, "simplified"> & { profitVisible?: boolean }) => [
  { key: "company", label: "SPÓŁKA" },
  { key: "amount", label: "WYSOKOŚĆ" },
  { key: "ratio", label: "STOPA %" },
  { key: "date", label: "DZIEŃ DYWIDENDY" },
  ...(simplified
    ? []
    : [
        { key: "payment_date", label: "DZIEŃ WYPŁATY" },
        { key: "for_year", label: "ZA ROK OBROTOWY" },
      ]),
  ...(profitVisible
    ? [{ key: "net_profit" as ColumnKey, label: "ZYSK (NETTO)" }]
    : []),
  ...(profitVisible
    ? [{ key: "profit" as ColumnKey, label: "ZYSK (BRUTTO)" }]
    : []),
];

export default function DividendsTable({
  dividends,
  simplified,
  holdings,
}: Props) {
  const { data: settings } = useSettings();

  const renderCell = useCallback(
    (dividend: TableDividend, columnKey: ColumnKey) => {
      const cellValue = dividend[columnKey];
      switch (columnKey) {
        case "amount":
          return `${cellValue} PLN`;
        case "ratio":
          return cellValue + "%";
        case "for_year":
          return cellValue || "-";
        default:
          return cellValue;
      }
    },
    []
  );

  const validItems = holdings
    ? dividends.map((item) => {
        if (!holdings) return item;
        const profitFloat =
          parseFloat(item.amount) * (holdings[item.company] || 0);
        const netProfitFloat = profitFloat * 0.81;
        const formatter = new Intl.NumberFormat(settings?.language, {
          style: "currency",
          currency: item.currency,
        });
        const profit = formatter.format(profitFloat);
        const net_profit = formatter.format(netProfitFloat);
        return {
          ...item,
          net_profit,
          profit,
        };
      })
    : dividends;

  return (
    <HorizontalScroll>
      <Table
        shadow="none"
        aria-label="dividend-table"
        color="primary"
        className="max-w-full w-full flex-1 rounded-t-lg"
        removeWrapper
      >
        <TableHeader>
          {columns({ profitVisible: !!holdings, simplified }).map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={validItems}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.company + item.date} className="hover:bg-light">
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof Dividend)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </HorizontalScroll>
  );
}
