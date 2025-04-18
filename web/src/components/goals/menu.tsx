"use client";

import { deleteRows } from "@/lib/general/actions";
import { updateAsPriority } from "@/lib/goals/actions";

import {
  AlertOctagonIcon,
  MoreVerticalIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { Key, useState } from "react";
import toast from "react-hot-toast";
import Toast from "../ui/toast";
import { Dict } from "@/const/dict";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  dict: Dict["private"]["goals"]["list"]["goal"]["menu"];
  goal: Goal;
  onAdd?: () => void;
};

type Action = "priority" | "delete";

export default function Menu({ dict, goal }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingActions, setLoadingActions] = useState<Action[]>([]);

  async function onAction(e: Event, action: Action) {
    e.preventDefault();
    setLoadingActions((prev) => [...prev, action]);
    switch (action) {
      // case "add":
      //   onAdd && onAdd();
      //   setIsOpen(false);
      //   break;
      case "priority":
        const { error: updateError } = await updateAsPriority(goal.id);
        updateError &&
          toast.custom((t) => (
            <Toast {...t} type="error" message={updateError} />
          ));
        setIsOpen(false);
        break;
      case "delete":
        const { error: deleteError } = await deleteRows([goal.id], "goal");
        deleteError &&
          toast.custom((t) => (
            <Toast {...t} type="error" message={deleteError} />
          ));
        setIsOpen(false);
        break;
    }
    setLoadingActions((prev) => prev.filter((act) => act !== action));
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="h-6 w-6 rounded-full grid place-content-center">
        <MoreVerticalIcon size={20} className="text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownItem
          key="add"
          description={dict.add.description}
          startContent={<PlusIcon size={16} />}
        >
          {dict.add.title}
        </DropdownItem> */}
        <DropdownMenuItem
          disabled={goal.is_priority || loadingActions.includes("priority")}
          onSelect={(e) => onAction(e, "priority")}
        >
          <AlertOctagonIcon className="mx-1" size={16} />
          <div className="flex flex-col">
            <span>{dict.priority.title}</span>
            <span className="text-xs text-muted-foreground transition-colors duration-100 group-hover:text-foreground">
              {dict.priority.description}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={loadingActions.includes("delete")}
          onSelect={(e) => onAction(e, "delete")}
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
