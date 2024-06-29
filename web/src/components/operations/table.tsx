"use client";

import { MouseEvent, useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  ScrollShadow,
  Button,
} from "@nextui-org/react";
import useTableQuery from "@/hooks/useTableQuery";
import TopContent from "../ui/table/top-content";
import Block from "../ui/block";
import Empty from "../ui/empty";
import useSelection from "@/hooks/useSelection";
import { PaperclipIcon } from "lucide-react";
import DocModal from "./doc-modal";

export default function OperationTable({
  rows,
  count,
  viewOnly,
  children,
  ...props
}: TableProps<Operation>) {
  const [docPath, setDocPath] = useState<string | null>(null);
  const pages = Math.ceil(count / 10);
  const {
    items,
    isLoading,
    setIsLoading,
    searchQuery,
    handleSearch,
    handleSort,
    handlePageChange,
    handleLabelChange,
    handleCurrencyChange,
  } = useTableQuery(rows, !!viewOnly);
  const {
    selectionMode,
    selectedKeys,
    onSelectionChange,
    onRowAction,
    setSelectedKeys,
  } = useSelection((viewOnly ? items : rows).map((item) => item.id));
  const { page, sort, search, label: _label } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [rows]);

  const columns = useCallback(
    (hasLabel: boolean, hasDoc: boolean) => [
      { key: "issued_at", label: "DATA" },
      { key: "title", label: "TYTUŁ" },
      ...(items.some((item) => item.description)
        ? [{ key: "description", label: "OPIS" }]
        : []),
      { key: "amount", label: "KWOTA" },
      { key: "currency", label: "WALUTA" },
      ...(hasLabel ? [{ key: "label", label: "ETYKIETA" }] : []),
      ...(hasDoc ? [{ key: "doc_path", label: "" }] : []),
    ],
    [page]
  );

  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "title":
        return (
          <span className="line-clamp-1 break-all xl:max-w-[5vw]">
            {cellValue}
          </span>
        );
      case "label":
        return (
          <span className="line-clamp-1 break-all xl:max-w-[10vw]f">
            {cellValue}
          </span>
        );
      case "description":
        return (
          <span className="line-clamp-1 break-all xl:max-w-[10vw]">
            {cellValue}
          </span>
        );
      case "issued_at":
        return (
          <span className="line-clamp-1 break-all w-[10ch]">
            {new Intl.DateTimeFormat("pl-PL", {
              dateStyle: "short",
            }).format(new Date(cellValue))}
          </span>
        );
      case "doc_path":
        const handleChange = (e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setDocPath(cellValue);
        };
        return cellValue ? (
          <Button
            size="sm"
            isIconOnly
            onClick={handleChange}
            radius="md"
            disableRipple
            className="flex items-center ml-auto relative z-40 -my-2 border border-primary/10"
          >
            <PaperclipIcon size={18} />
          </Button>
        ) : (
          <></>
        );
      default:
        return <span className="line-clamp-1 break-all">{cellValue}</span>;
    }
  }, []);

  return (
    <Block
      title={props.title}
      className="w-screen sm:w-full"
      hideTitleMobile
      cta={
        <TopContent
          {...props}
          selected={selectedKeys}
          handleSearch={handleSearch}
          deletionCallback={() => setSelectedKeys([])}
          search={search}
          addHref={`/${props.type}s/add`}
          state={{
            label: {
              value: searchQuery.label,
              onChange: handleLabelChange,
            },
            currency: {
              value: searchQuery.currency,
              onChange: handleCurrencyChange,
            },
          }}
        />
      }
    >
      <DocModal docPath={docPath} setDocPath={setDocPath} />
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <Table
          removeWrapper
          shadow="none"
          color="primary"
          sortDescriptor={{
            column: sort?.includes("-")
              ? sort?.split("-")[1]
              : sort?.toString(),
            direction: sort?.includes("-") ? "descending" : "ascending",
          }}
          onSortChange={handleSort}
          topContentPlacement="outside"
          bottomContentPlacement="outside"
          aria-label="operations-table"
          className="max-w-full w-full flex-1"
          selectionMode={selectionMode}
          checkboxesProps={{
            classNames: {
              wrapper: "text-background",
            },
          }}
          selectedKeys={
            (viewOnly ? items : rows).every((item) =>
              selectedKeys.includes(item.id)
            )
              ? "all"
              : new Set(selectedKeys)
          }
          onSelectionChange={onSelectionChange}
          classNames={{
            tr: "cursor-pointer",
            td: "[&_span:last-child]:before:!border-neutral-200",
          }}
        >
          <TableHeader>
            {columns(
              rows.some((item) => item.label),
              rows.some((item) => item.doc_path)
            ).map((column) => (
              <TableColumn
                key={column.key}
                allowsSorting={count > 0 && !viewOnly ? true : undefined}
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            items={viewOnly ? items : rows}
            isLoading={isLoading}
            emptyContent={
              <Empty
                title="Nie znaleziono operacji"
                cta={
                  viewOnly
                    ? undefined
                    : {
                        title: `Dodaj ${
                          props.type === "expense" ? "wydatek" : "przychód"
                        }`,
                        href: `/${props.type}s/add`,
                      }
                }
              />
            }
            loadingContent={<Spinner />}
          >
            {(operation) => (
              <TableRow
                onDoubleClick={(_event) => onRowAction(operation.id)}
                key={operation.id}
                className="hover:bg-light"
              >
                {(columnKey) => (
                  <TableCell>{renderCell(operation, columnKey)}</TableCell>
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
              wrapper: "!shadow-none",
            }}
            page={page}
            isDisabled={isLoading}
            total={pages}
            onChange={handlePageChange}
          />
        </div>
      )}
      {children}
    </Block>
  );
}
