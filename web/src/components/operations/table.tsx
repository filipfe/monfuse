"use client";

import { useContext, useMemo, useState } from "react";
import useTableQuery from "@/hooks/useTableQuery";
import TopContent from "../ui/table/top-content";
import Block from "../ui/block";
import Empty from "../ui/empty";
import { PaperclipIcon } from "lucide-react";
import DocModal from "./doc-modal";
import ActionsDropdown from "./actions-dropdown";
import { PeriodContext } from "@/app/(private)/(sidebar)/(operations)/providers";
import { Dict } from "@/const/dict";
import { useOperations } from "@/lib/operations/queries";
import DataTable from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatNumber, formatPrice } from "@/utils/format";
import { Button } from "../ui/button";
import { Pagination } from "@heroui/react";
import { useSWRConfig } from "swr";

interface Props extends TableProps {
  settings: Settings;
  dict: Dict["private"]["operations"]["operation-table"];
  title: string;
}

export default function OperationTable({
  title,
  dict,
  children,
  type,
  settings,
}: Props) {
  const { mutate } = useSWRConfig();
  const [pages, setPages] = useState(0);
  const [docPath, setDocPath] = useState<string | null>(null);
  const { searchQuery, handleSearch, changeFilter } = useTableQuery();
  const { period } = useContext(PeriodContext);
  const {
    data,
    mutate: mutateOperations,
    isLoading,
  } = useOperations(
    type,
    {
      ...searchQuery,
      from: period.from || undefined,
      to: period.to || undefined,
    },
    settings.timezone,
    {
      onSuccess: (data) => setPages(Math.ceil(data.count / 10)),
    }
  );

  const operations = data?.results || [];

  const { hasDoc, hasLabel } = useMemo(
    () => ({
      hasDoc: operations.some((item) => item.doc_path),
      hasLabel: operations.some((item) => item.label),
    }),
    [data]
  );

  const columns: ColumnDef<Operation>[] = useMemo(
    () => [
      {
        accessorFn: ({ issued_at }) =>
          new Intl.DateTimeFormat(settings.language, {
            dateStyle: "short",
            timeZone: settings.timezone,
          }).format(new Date(issued_at)),
        header: dict.columns.issued_at,
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
      // {
      //   accessorKey: "currency",
      //   header: dict.columns.currency
      // }
      ...(hasLabel
        ? [
            {
              accessorFn: ({ label }) => label || "-",
              header: dict.columns.label,
            } as ColumnDef<Operation>,
          ]
        : []),
      ...(hasDoc
        ? [
            {
              accessorKey: "doc_path",
              header: "",
              cell: ({ row }) =>
                row.original.doc_path ? (
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDocPath(row.original.doc_path);
                    }}
                  >
                    <PaperclipIcon size={18} />
                  </Button>
                ) : (
                  <></>
                ),
              size: 32,
            } as ColumnDef<Operation>,
          ]
        : []),
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <ActionsDropdown
            dict={dict.dropdown}
            type={type}
            timezone={settings.timezone}
            operation={row.original}
            mutate={async () => {
              const promises = [
                mutateOperations(),
                mutate([
                  "history",
                  type,
                  settings.timezone,
                  row.original.currency,
                ]),
              ];
              if (type === "expense") {
                promises.push(
                  mutate(["limits", settings.timezone, row.original.currency])
                );
              }
              await Promise.all(promises);
            }}
          />
        ),
        size: 32,
      },
    ],
    [dict, settings, type, hasLabel, hasDoc]
  );

  // const {
  //   selectionMode,
  //   selectedKeys,
  //   onSelectionChange,
  //   onRowAction,
  //   setSelectedKeys,
  // } = useSelection((viewOnly ? items : rows).map((item) => item.id));
  const { page, sort, search, label: _label } = searchQuery;

  return (
    <Block
      title={title}
      className="w-screen sm:w-full"
      hideTitleMobile
      cta={
        <TopContent
          type={type}
          dict={dict["top-content"]}
          viewOnly={false}
          // selected={selectedKeys}
          handleSearch={handleSearch}
          // deletionCallback={() => setSelectedKeys([])}
          search={search}
          addHref={`/${type}s/add`}
          state={{
            label: {
              value: searchQuery.label || "*",
              onChange: (value) => changeFilter("label", value),
            },
            currency: {
              value: searchQuery.currency || "*",
              onChange: (value) => changeFilter("currency", value),
            },
          }}
          showPeriodFilter
        />
      }
    >
      <DocModal dict={dict.modal} docPath={docPath} setDocPath={setDocPath} />
      <DataTable
        data={operations}
        columns={columns}
        isLoading={isLoading}
        enableSorting
        className="[&_td]:h-11 [&_td]:py-0 [&_td]:whitespace-nowrap [&_td]:max-w-24 [&_td]:text-ellipsis [&_td]:overflow-hidden"
        dict={{ _empty: dict._empty.title }}
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
            onChange={(value) => changeFilter("page", value)}
          />
        </div>
      )}
      {children}
    </Block>
  );
}
