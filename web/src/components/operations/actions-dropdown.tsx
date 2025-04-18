import { MoreVerticalIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Fragment, useTransition } from "react";
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
import { deleteRows } from "@/lib/general/queries";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { updateOperation } from "@/lib/operations/actions";
import dateFormat from "@/utils/formatters/dateFormat";
import Manual from "./inputs/manual";
import toast from "@/utils/toast";

type Props = {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"];
  operation: Operation;
  // onSelect?: () => void;
  mutate: () => Promise<void>;
  type: OperationType;
  timezone: Settings["timezone"];
};

export default function ActionsDropdown({
  dict,
  operation,
  type,
  timezone,
  mutate,
}: Props) {
  const [isUpdatePending, startUpdate] = useTransition();

  async function handleDelete() {
    const { error } = await deleteRows([operation.id], type);
    if (error) {
      // toast
    } else {
      await mutate();
    }
  }

  function updateAction(formData: FormData) {
    startUpdate(async () => {
      const { error } = await updateOperation(
        formData,
        timezone,
        dateFormat(operation.issued_at, timezone, "yyyy-MM-dd")
      );
      if (error) {
        toast({
          type: "error",
          message: dict.modal.edit.form._error,
        });
      } else {
        await mutate();
        toast({
          type: "success",
          message: dict.modal.edit.form._success,
        });
      }
    });
  }

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
                  {dict.modal.edit.title[type as "income" | "expense"]}{" "}
                  <span className="font-bold">{operation.title}</span>
                </DialogTitle>
              </DialogHeader>
              <form action={updateAction}>
                <div>
                  <Manual
                    dict={dict.modal.edit.form}
                    timezone={timezone}
                    withLabel={type === "expense"}
                    initialValue={operation}
                    type={type}
                  />
                </div>
                <DialogFooter>
                  <Button loading={isUpdatePending}>
                    {dict.modal.edit.form._submit.label}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="group pr-4"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2Icon size={14} className="text-danger mx-1" />
                <div className="flex flex-col">
                  <span className="text-danger">{dict.menu.delete.title}</span>
                  <span className="text-xs text-muted-foreground transition-colors duration-100 group-hover:text-danger">
                    {dict.menu.delete.description}
                  </span>
                </div>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-normal">
                  {dict.modal.delete.title}{" "}
                  <span className="font-bold">{operation.title}</span>?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dict.modal.delete.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">
                    {dict.modal.delete.button._close}
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="destructive" onClick={handleDelete}>
                    {dict.modal.delete.button._submit}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}
