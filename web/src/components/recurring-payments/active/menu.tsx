"use client";

import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Dict } from "@/const/dict";
import {
  deleteRecurringPayment,
  useActivePayments,
  useUpcomingPayments,
} from "@/lib/recurring-payments/queries";
import toast from "@/utils/toast";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { MoreVerticalIcon, PauseIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

type Props = {
  payment: WithId<RecurringPayment>;
  page: number;
  timezone: string;
  dict: Dict["private"]["operations"]["recurring-payments"]["active"]["menu"];
};

export default function Menu({ payment: { id }, dict, page, timezone }: Props) {
  const { mutate } = useActivePayments(page);
  const { mutate: mutateUpcoming } = useUpcomingPayments(timezone);
  const [isLoading, setIsLoading] = useState({
    deletion: false,
  });
  return (
    <Dropdown shadow="sm" placement="bottom-end">
      <DropdownTrigger>
        <button className="h-6 w-6 rounded-full grid place-content-center">
          <MoreVerticalIcon size={20} />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        variant="faded"
        aria-label="Dropdown menu with description for recurring payments"
        closeOnSelect={false}
        disabledKeys={[...(isLoading.deletion ? ["delete"] : [])]}
        onAction={async (key) => {
          switch (key) {
            case "delete":
              setIsLoading((prev) => ({ ...prev, deletion: true }));
              const { error } = await deleteRecurringPayment(id);
              if (error) {
                toast({
                  type: "error",
                  message: dict._error.delete,
                });
              } else {
                mutate();
                mutateUpcoming();
              }
              setIsLoading((prev) => ({ ...prev, deletion: false }));
              break;
            default:
              break;
          }
        }}
      >
        {/* <DropdownItem
          key="pause"
          description={dict.pause.description}
          startContent={<PauseIcon size={16} />}
          closeOnSelect={false}
          showDivider
        >
          {dict.pause.title}
        </DropdownItem> */}
        <DropdownItem
          closeOnSelect={false}
          key="delete"
          className="text-danger"
          color="danger"
          description={dict.delete.description}
          startContent={<Trash2Icon className="text-danger" size={16} />}
        >
          {dict.delete.title}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
