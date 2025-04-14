"use client";

import {
  Dropdown as DropdownWrapper,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { MoreVertical, Undo } from "lucide-react";
import { Key } from "react";

type Action = "revert";

export default function Dropdown(payment: Payment) {
  const onAction = (key: Key) => {
    switch (key) {
    }
  };

  return (
    <DropdownWrapper placement="left-start">
      <DropdownTrigger>
        <MoreVertical className="cursor-pointer" size={20} />
      </DropdownTrigger>
      <DropdownMenu variant="faded" onAction={onAction}>
        <DropdownItem
          className="data-[hover=true]:transition-none text-danger [&_span:last-child]:text-danger"
          color="danger"
          startContent={<Undo size={16} />}
          description="Undo operation"
          key="revert"
        >
          Revert
        </DropdownItem>
      </DropdownMenu>
    </DropdownWrapper>
  );
}
