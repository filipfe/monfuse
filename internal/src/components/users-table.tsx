"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import { Badge } from "./ui/badge";

const columns: ColumnDef<User>[] = [
  {
    accessorFn: ({ first_name, last_name }) => `${first_name} ${last_name}`,
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telegram_id",
    header: "Telegram",
    cell: ({ row }) =>
      row.original.telegram_id ? (
        <Badge variant="success">Registered</Badge>
      ) : (
        <Badge variant="destructive">Not registered</Badge>
      ),
  },
  {
    accessorKey: "has_used_trial",
    header: "Trial",
    cell: ({ row }) =>
      row.original.has_used_trial ? (
        <Badge variant="destructive">Used</Badge>
      ) : (
        <Badge variant="success">Available</Badge>
      ),
  },
];

export default function UsersTable({ data }: Data<User>) {
  return <DataTable data={data} columns={columns} />;
}
