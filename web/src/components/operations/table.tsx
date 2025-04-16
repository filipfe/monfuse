"use client";

import { MouseEvent, useCallback, useContext, useMemo, useState } from "react";
import useTableQuery from "@/hooks/useTableQuery";
import TopContent from "../ui/table/top-content";
import Block from "../ui/block";
import Empty from "../ui/empty";
import { PaperclipIcon } from "lucide-react";
import DocModal from "./modals/doc-modal";
import ActionsDropdown from "./actions-dropdown";
import { PeriodContext } from "@/app/(private)/(sidebar)/(operations)/providers";
import { Dict } from "@/const/dict";
import { useOperations } from "@/lib/operations/queries";
import DataTable from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatNumber, formatPrice } from "@/utils/format";
import { Button } from "../ui/button";
import { Pagination } from "@heroui/react";

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
  const [pages, setPages] = useState(0);
  const [docPath, setDocPath] = useState<string | null>(null);
  const { searchQuery, handleSearch, changeFilter } = useTableQuery();
  const { period } = useContext(PeriodContext);
  const { data, isLoading } = useOperations(
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
  // const { period } = useContext(PeriodContext);
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
      ...(type === "expense"
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
            operation={row.original}
          />
        ),
      },
    ],
    [dict, settings, type, hasDoc]
  );

  // const {
  //   selectionMode,
  //   selectedKeys,
  //   onSelectionChange,
  //   onRowAction,
  //   setSelectedKeys,
  // } = useSelection((viewOnly ? items : rows).map((item) => item.id));
  const { page, sort, search, label: _label } = searchQuery;

  // const columns = useCallback(
  //   (hasLabel: boolean, hasDoc: boolean) => [
  //     { key: "issued_at", label: dict.columns.issued_at },
  //     { key: "title", label: dict.columns.title },
  //     { key: "amount", label: dict.columns.amount },
  //     { key: "currency", label: dict.columns.currency },
  //     ...(hasLabel ? [{ key: "label", label: dict.columns.label }] : []),
  //     ...(hasDoc ? [{ key: "doc_path", label: "" }] : []),
  //     { key: "actions", label: "" },
  //   ],
  //   [page]
  // );

  // const renderCell = useCallback(
  //   (item: any, columnKey: any) => {
  //     const cellValue = item[columnKey];

  //     switch (columnKey) {
  //       case "title":
  //         return <span className="line-clamp-1 break-all">{cellValue}</span>;
  //       case "label":
  //         return (
  //           <span className="line-clamp-1 break-all">{cellValue || "-"}</span>
  //         );
  //       case "issued_at":
  //         return (
  //           <span className="line-clamp-1 break-all w-[10ch]">
  //             {new Intl.DateTimeFormat(settings.language, {
  //               dateStyle: "short",
  //               timeZone: settings.timezone,
  //             }).format(new Date(cellValue))}
  //           </span>
  //         );
  //       case "doc_path":
  //         const handleChange = (e: MouseEvent<HTMLButtonElement>) => {
  //           e.preventDefault();
  //           e.stopPropagation();
  //           setDocPath(cellValue);
  //         };
  //         return cellValue ? (
  //           <Button
  //             size="sm"
  //             isIconOnly
  //             onClick={handleChange}
  //             radius="md"
  //             disableRipple
  //             className="flex items-center ml-auto relative z-40 -my-2 border"
  //           >
  //             <PaperclipIcon size={18} />
  //           </Button>
  //         ) : (
  //           <></>
  //         );
  //       // case "actions":
  //       //   return selectedKeys.length === 0 ? (
  //       //     <ActionsDropdown
  //       //       type={props.type}
  //       //       operation={item}
  //       //       onSelect={() => onRowAction(item.id)}
  //       //     />
  //       //   ) : (
  //       //     <></>
  //       //   );
  //       case "actions":
  //         return (
  //           <ActionsDropdown
  //             dict={dict.dropdown}
  //             type={type}
  //             operation={item}
  //           />
  //         );
  //       default:
  //         return <span className="line-clamp-1 break-all">{cellValue}</span>;
  //     }
  //   },
  //   [
  //     // selectedKeys,
  //     type,
  //     //  onRowAction
  //   ]
  // );

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
        enableSorting
        // className="[&_td]:whitespace-nowrap [&_td]:text-ellipsis [&_td]:overflow-hidden"
        className="[&_td]:h-11 [&_td]:py-0 [&_td]:whitespace-nowrap [&_td]:max-w-24 [&_td]:text-ellipsis [&_td]:overflow-hidden"
      />
      {/* <ScrollShadow orientation="horizontal" hideScrollBar>
        <Table
          removeWrapper
          shadow="none"
          color="primary"
          sortDescriptor={
            sort
              ? {
                  column: sort.includes("-")
                    ? sort.split("-")[1]
                    : sort.toString(),
                  direction: sort.includes("-") ? "descending" : "ascending",
                }
              : undefined
          }
          onSortChange={(descriptor) =>
            changeFilter(
              "sort",
              (descriptor.direction === "descending" ? "-" : "") +
                descriptor.column
            )
          }
          topContentPlacement="outside"
          bottomContentPlacement="outside"
          aria-label="operations-table"
          className="max-w-full w-full flex-1"
          classNames={{
            td: "[&_span:last-child]:before:!border-neutral-200",
          }}
        >
          <TableHeader>
            {columns(
              operations.some((item) => item.label),
              operations.some((item) => item.doc_path)
            ).map((column) => (
              <TableColumn
                key={column.key}
                allowsSorting={
                  column.key !== "actions" && column.key !== "doc_path"
                }
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            items={operations}
            isLoading={isLoading}
            emptyContent={
              <Empty
                title={dict._empty.title}
                cta={{
                  title: dict._empty.button[type as "expense" | "income"],
                  href: `/${type}s/add`,
                }}
              />
            }
            loadingContent={<Spinner />}
          >
            {(operation) => (
              <TableRow className="hover:bg-light" key={operation.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(operation, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollShadow> */}
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
