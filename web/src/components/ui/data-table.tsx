"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/cn";
import { Hatch } from "ldrs/react";

interface DataTableProps<TData, TValue> extends Partial<TableOptions<TData>> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  className?: string;
  isLoading?: boolean;
  dict: {
    _empty: string;
  };
}

export default function DataTable<TData, TValue>({
  data,
  columns,
  className,
  dict,
  isLoading,
  ...props
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(props.enableSorting ? { getSortedRowModel: getSortedRowModel() } : {}),
    ...props,
  });

  return (
    <Table className={cn("w-full", className)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className="!h-24">
              <div className="h-full w-full flex justify-center items-center">
                <Hatch size={24} />
              </div>
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  style={{ width: cell.column.getSize() }}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className="!h-24 text-center">
              {dict._empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
