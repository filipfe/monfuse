import { MoreVerticalIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { FormEvent, Fragment, useState } from "react";
import { Dict } from "@/const/dict";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Manual from "./inputs/manual";
import formDataToOperation from "@/utils/operations/form-data-to-operation";

type Props = {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"];
  timezone: Settings["timezone"];
  operation: Operation;
  onEdit: (data: Operation) => void;
  onDelete: () => void;
};

export default function PreviewActionsDropdown({
  dict,
  timezone,
  operation,
  onEdit,
  onDelete,
}: Props) {
  const onEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    onEdit(formDataToOperation(formData, operation.id));
  };

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-6 w-6 rounded-full grid place-content-center ml-auto">
            <MoreVerticalIcon size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                className="group pr-4"
                onSelect={(e) => e.preventDefault()}
              >
                <SquarePenIcon size={14} className="mx-1" />
                <div className="flex flex-col">
                  <span>{dict.menu.edit.title}</span>
                  <span className="text-xs text-muted-foreground transition-colors duration-100 group-hover:text-foreground">
                    {dict.menu.edit.description}
                  </span>
                </div>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {
                    dict.modal.edit.title[
                      operation.type as "income" | "expense"
                    ]
                  }{" "}
                  <span className="font-bold">{operation.title}</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={onEditSubmit}>
                <div>
                  <Manual
                    dict={dict.modal.edit.form}
                    timezone={timezone}
                    initialValue={operation}
                    type={operation.type!}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit">
                      {dict.modal.edit.form._submit.label}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <DropdownMenuItem className="group pr-4" onSelect={onDelete}>
            <Trash2Icon size={14} className="text-danger mx-1" />
            <div className="flex flex-col">
              <span className="text-danger">{dict.menu.delete.title}</span>
              <span className="text-xs text-muted-foreground transition-colors duration-100 group-hover:text-danger">
                {dict.menu.delete.description}
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}
