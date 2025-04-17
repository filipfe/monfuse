"use client";

import { Pagination } from "@heroui/react";
import Block from "../../ui/block";
import { useActivePayments } from "@/lib/recurring-payments/queries";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Coins, PlusIcon, Wallet2 } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/stocks/loader";
import { Dict } from "@/const/dict";
import Menu from "./menu";
import Empty from "@/components/ui/empty";
import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatPrice } from "@/utils/format";
import { Button } from "@/components/ui/button";

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
  const [pages, setPages] = useState(0);
  const { data, isLoading, mutate } = useActivePayments(page, {
    onSuccess: (data) => setPages(Math.ceil(data.count / 6)),
  });

  const columns = useMemo<ColumnDef<RecurringPayment>[]>(
    () => [
      {
        accessorKey: "type",
        header: "",
        cell: ({ row }) =>
          row.original.type === "income" ? (
            <Wallet2 size={15} color="#177981" />
          ) : (
            <Coins size={16} color="#fdbb2d" />
          ),
        size: 20,
      },
      {
        accessorKey: "title",
        header: dict.columns.title,
      },
      {
        accessorFn: ({ amount, currency }) =>
          formatPrice(amount, currency, settings.language),
        header: dict.columns.amount,
      },
      {
        accessorFn: ({ next_payment }) =>
          new Intl.DateTimeFormat(settings.language).format(
            new Date(next_payment)
          ),
        header: dict.columns["next-payment"],
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Menu
            payment={row.original}
            timezone={settings.timezone}
            dict={dict.menu}
            onDelete={mutate}
          />
        ),
        size: 20,
      },
    ],
    [dict, settings]
  );

  const cta = (
    <Button variant="outline" size="sm" asChild>
      <Link href="/recurring-payments/add">
        <PlusIcon size={14} />
        {dict.add.label}
      </Link>
    </Button>
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

  const payments = data?.results || [];

  return (
    <Block
      title={dict.title}
      className="row-span-2 col-start-1 col-end-2"
      cta={cta}
    >
      {payments.length > 0 || isLoading ? (
        <>
          <DataTable
            data={payments}
            columns={columns}
            isLoading={isLoading}
            dict={{ _empty: dict._empty.title }}
            className="[&_td]:h-11"
          />
          {pages > 0 && (
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
                total={pages}
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
