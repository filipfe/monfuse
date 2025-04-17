"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Pagination } from "@heroui/react";
import useTableQuery from "@/hooks/useTableQuery";
import { PaperclipIcon } from "lucide-react";
import Block from "./block";
import DocModal from "../operations/modals/doc-modal";
import Empty from "./empty";
import { TRANSACTION_TYPES } from "@/const";
import ActionsDropdown from "../operations/actions-dropdown";
import { useSettings } from "@/lib/general/queries";
import { Dict } from "@/const/dict";
import DataTable from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatPrice } from "@/utils/format";
import { Button } from "./button";

type Props<T> = {
  title: string;
  dict: Dict["private"]["operations"]["operation-table"];
  count: number;
  children?: ReactNode;
  rows: T[];
  topContent?: ReactNode;
  setRows: Dispatch<SetStateAction<T[]>>;
};

export default function PreviewTable({
  title,
  dict,
  count,
  children,
  rows,
  setRows,
}: Props<Operation>) {
  const { data: settings } = useSettings();
  const [docPath, setDocPath] = useState<string | null>(null);
  const pages = Math.ceil(count / 10);
  const { items, setItems, searchQuery, changeFilter, handleSearch } =
    useTableQuery<Operation>();
  const { page } = searchQuery;

  useEffect(() => {
    setItems(rows);
  }, [rows]);
  // const { selectionMode, selectedKeys, onSelectionChange, onRowAction } =
  //   useSelection(items.map((item) => item.id));

  // const getColumns = (type: OperationType, hasDoc: boolean) => {
  //   if (type === "stock") {
  //     return [
  //       { key: "issued_at", label: "DATA" },
  //       { key: "symbol", label: "INSTRUMENT" },
  //       { key: "transaction_type", label: "TRANSAKCJA" },
  //       { key: "quantity", label: "ILOŚĆ" },
  //       { key: "price", label: "CENA" },
  //       { key: "commission", label: "PROWIZJA" },
  //       { key: "actions", label: "" },
  //     ];
  //   } else {
  //     return [
  //       { key: "issued_at", label: dict.columns.issued_at },
  //       { key: "title", label: dict.columns.title },
  //       { key: "amount", label: dict.columns.amount },
  //       { key: "currency", label: dict.columns.currency },
  //       ...(hasDoc ? [{ key: "doc_path", label: "" }] : []),
  //       { key: "actions", label: "" },
  //     ];
  //   }
  // };

  const hasDoc = useMemo(() => items.some((item) => !!item.doc_path), [items]);

  const columns = useMemo<ColumnDef<Operation>[]>(
    () => [
      {
        accessorFn: ({ issued_at }) =>
          issued_at
            ? new Intl.DateTimeFormat(settings?.language, {
                dateStyle: "short",
              }).format(new Date(issued_at))
            : "-",
        header: dict.columns.issued_at,
      },
      {
        accessorKey: "title",
        header: dict.columns.title,
      },
      {
        accessorFn: ({ amount, currency }) =>
          formatPrice(amount, currency, settings?.language),
        header: dict.columns.amount,
      },
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
        // cell: ({ row }) => <ActionsDropdown
        //             dict={dict.dropdown}
        //             operation={item}
        //             // onSelect={() => onRowAction(item.id)}
        //             // onDelete={(id) => {
        //             //   setItems((prev) => prev.filter((r) => r.id !== id));
        //             //   items.length === 0 && setRows([]);
        //             // }}
        //             onEdit={(updated) =>
        //               setItems((prev) => {
        //                 const newArr = [...prev];
        //                 const index = newArr.findIndex((row) => row.id === item.id);
        //                 if (index === -1) return prev;
        //                 const newObj = { ...newArr[index], ...updated };
        //                 newArr[index] = newObj;
        //                 return newArr;
        //               })
        //             }
        //           />
      },
    ],
    [dict.columns, hasDoc]
  );

  return (
    <Block
      title={title}
      className="max-w-3xl w-full mx-auto"
      // cta={
      //   <TopContent
      //     type={type}
      //     selected={selectedKeys}
      //     handleSearch={handleSearch}
      //     deletionCallback={() => setSelectedKeys([])}
      //     search={search}
      //     state={{
      //       currency: {
      //         value: searchQuery.currency,
      //         onChange: handleCurrencyChange,
      //       },
      //       ...(type === "stock" && {
      //         transaction: {
      //           value: searchQuery.transaction,
      //           onChange: handleTransactionChange,
      //         },
      //       }),
      //     }}
      //     viewOnly
      //   />
      // }
    >
      <DocModal dict={dict.modal} docPath={docPath} setDocPath={setDocPath} />
      <DataTable
        data={items}
        columns={columns}
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
            total={pages}
            onChange={(value) => changeFilter("page", value)}
          />
        </div>
      )}
      {children}
    </Block>
  );
}

// useEffect(() => {
//   let filteredRows = [...rows];
//   if (search) {
//     filteredRows = filteredRows.filter((row) => {
//       if (type === "stock") {
//         return (row as StockTransaction).symbol
//           .toLowerCase()
//           .includes(search.toLowerCase());
//       } else {
//         return (row as Operation).title
//           .toLowerCase()
//           .includes(search.toLowerCase());
//       }
//     });
//   }

//   if (currency) {
//     filteredRows = filteredRows.filter((row) =>
//       row.currency.includes(currency)
//     );
//   }

//   const start = ((searchQuery.page || 1) - 1) * 10;
//   const end = start + 10;
//   setItems(filteredRows.slice(start, end));

//   isLoading && setIsLoading(false);
// }, [rows, searchQuery]);
