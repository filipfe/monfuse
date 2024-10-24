"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  ScrollShadow,
  getKeyValue,
} from "@nextui-org/react";
import Block from "../ui/block";
import { useActivePayments } from "@/lib/recurring-payments/queries";
import { useCallback, useState } from "react";
import { Coins, Wallet2 } from "lucide-react";

export default function RecurringPaymentsTable() {
  const [page, setPage] = useState<number>(1);

  const columns = [
    {
      key: "type",
      label: "",
    },
    {
      key: "title",
      label: "TITLE",
    },
    {
      key: "amount",
      label: "AMOUNT",
    },
    {
      key: "currency",
      label: "CURRENCY",
    },
    {
      key: "last_payment",
      label: "LAST PAYMENT",
    },
    {
      key: "next_payment",
      label: "NEXT PAYMENT",
    },
  ];

  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "type":
        return (
          <>
            {item.type === "income" ? (
              <Wallet2 size={14} color="#177981" />
            ) : (
              <Coins size={14} color="#fdbb2d" />
            )}
          </>
        );
      case "title":
        return (
          <span className="line-clamp-1 break-all min-w-[14ch]">
            {cellValue}
          </span>
        );
      default:
        return cellValue;
    }
  }, []);

  const { isLoading, data } = useActivePayments(page);
  if (isLoading) return;
  const results = data?.results || [];
  const count = data?.count || 0;

  return (
    <Block
      title={"Aktywne"}
      className="w-screen sm:w-full col-span-3"
      hideTitleMobile
    >
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <Table
          removeWrapper
          shadow="none"
          color="primary"
          bottomContentPlacement="outside"
          aria-label="recurring-paymants-table"
          className="max-w-full w-full flex-1"
          classNames={{
            td: "[&_span:last-child]:before:!border-neutral-200",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={results}>
            {(item) => (
              <TableRow key={item.id} className="hover:bg-light">
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollShadow>
      {count > 0 && (
        <div className="mt-2 flex-1 flex items-end justify-end">
          <Pagination
            size="sm"
            isCompact
            showControls
            showShadow={false}
            color="primary"
            className="text-background"
            classNames={{
              wrapper: "!shadow-none border",
            }}
            page={page}
            isDisabled={isLoading}
            total={Math.ceil(count / 8)}
            onChange={setPage}
          />
        </div>
      )}
    </Block>
  );
}
