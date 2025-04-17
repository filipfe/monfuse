"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dict } from "@/const/dict";
import {
  deleteRecurringPayment,
  useUpcomingPayments,
} from "@/lib/recurring-payments/queries";
import toast from "@/utils/toast";
import { MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

type Props = {
  payment: WithId<RecurringPayment>;
  timezone: string;
  dict: Dict["private"]["operations"]["recurring-payments"]["active"]["menu"];
  onDelete: () => void;
};

export default function Menu({
  payment: { id },
  dict,
  timezone,
  onDelete,
}: Props) {
  const { mutate: mutateUpcoming } = useUpcomingPayments(timezone);
  const [isLoading, setIsLoading] = useState({
    deletion: false,
  });

  async function handleDelete() {
    setIsLoading((prev) => ({ ...prev, deletion: true }));
    const { error } = await deleteRecurringPayment(id);
    if (error) {
      toast({
        type: "error",
        message: dict._error.delete,
      });
    } else {
      onDelete();
      mutateUpcoming();
    }
    setIsLoading((prev) => ({ ...prev, deletion: false }));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-6 w-6 rounded-full grid place-content-center ml-auto">
        <MoreVerticalIcon size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="group pr-4"
          // onSelect={(e) => e.preventDefault()}
          onSelect={handleDelete}
          disabled={isLoading.deletion}
        >
          <Trash2Icon size={14} className="text-danger mx-1" />
          <div className="flex flex-col">
            <span className="text-danger">{dict.delete.title}</span>
            <span className="text-xs text-muted-foreground transition-colors duration-100 group-hover:text-danger">
              {dict.delete.description}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
