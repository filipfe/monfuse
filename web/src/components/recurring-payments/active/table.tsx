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
  Button,
} from "@nextui-org/react";
import Block from "../../ui/block";
import { useActivePayments } from "@/lib/recurring-payments/queries";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Coins, PlusIcon, Wallet2 } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/stocks/loader";
import { Dict } from "@/const/dict";
import Menu from "./menu";
import Empty from "@/components/ui/empty";

type Props = {
  settings: Settings;
  dict: Dict["private"]["operations"]["recurring-payments"]["active"];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

export default function RecurringPaymentsTable({
  settings,
  dict,
  page,
  setPage,
}: Props) {
  const { isLoading, data } = useActivePayments(page);

  const columns = useMemo(
    () => [
      {
        key: "type",
        label: "",
      },
      {
        key: "title",
        label: dict.columns.title,
      },
      {
        key: "amount",
        label: dict.columns.amount,
      },
      {
        key: "currency",
        label: dict.columns.currency,
      },
      {
        key: "next_payment",
        label: dict.columns["next-payment"],
      },
      { key: "actions", label: "" },
    ],
    [dict.columns]
  );

  const renderCell = useCallback(
    (item: any, columnKey: any) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "type":
          return item.type === "income" ? (
            <Wallet2 size={15} color="#177981" />
          ) : (
            <Coins size={16} color="#fdbb2d" />
          );
        case "title":
          return (
            <span className="line-clamp-1 break-all min-w-[14ch]">
              {cellValue}
            </span>
          );
        case "amount":
          return new Intl.NumberFormat(settings.language).format(cellValue);
        case "next_payment":
          return new Intl.DateTimeFormat(settings.language).format(
            new Date(cellValue)
          );
        case "actions":
          return (
            <Menu
              payment={item}
              timezone={settings.timezone}
              page={page}
              dict={dict.menu}
            />
          );
        default:
          return cellValue;
      }
    },
    [page, settings.timezone]
  );

  const cta = (
    <Link href="/recurring-payments/add">
      <Button
        as="div"
        variant="light"
        disableRipple
        startContent={<PlusIcon size={14} />}
        className="h-8 bg-light border"
        size="sm"
        radius="md"
      >
        {dict.add.label}
      </Button>
    </Link>
  );

  if (isLoading)
    return (
      <Loader
        title={dict.title}
        cta={cta}
        className="row-span-2 col-start-1 col-end-2"
        records={8}
      />
    );

  const results = data?.results || [];
  const count = data?.count || 0;

  return (
    <Block
      title={dict.title}
      className="row-span-2 col-start-1 col-end-2"
      cta={cta}
    >
      {results.length > 0 ? (
        <>
          <ScrollShadow
            className="max-w-[calc(100vw-48px)]"
            orientation="horizontal"
            hideScrollBar
          >
            <Table
              removeWrapper
              shadow="none"
              color="primary"
              bottomContentPlacement="outside"
              aria-label="recurring-paymants-table"
              className="max-w-full w-full flex-1"
              classNames={{
                td: "[&_span:last-child]:before:!border-neutral-200 first:w-4",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn className="uppercase" key={column.key}>
                    {column.label}
                  </TableColumn>
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
        </>
      ) : (
        <Empty
          title={dict._empty.title}
          cta={{ title: dict.add.label, href: "/recurring-payments/add" }}
        />
      )}
    </Block>
  );
}
