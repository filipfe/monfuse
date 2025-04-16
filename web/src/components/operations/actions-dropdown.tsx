import { MoreVerticalIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Fragment, Key, useState } from "react";
import EditModal from "./modals/edit-modal";
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
import { useSWRConfig } from "swr";

type Props = {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"];
  operation: Operation;
  // onSelect?: () => void;
  onEdit?: (updated: Operation) => void;
  onDelete?: () => void;
  type: OperationType;
};

export default function ActionsDropdown({
  dict,
  operation,
  type,
  onDelete,
}: // onEdit,
// // onSelect,
Props) {
  const { mutate } = useSWRConfig();
  const [edited, setEdited] = useState<Operation | null>(null);
  // const [deleted, setDeleted] = useState<Operation | null>(null);

  // const onAction = (key: Key) => {
  //   switch (key) {
  //     // case "select":
  //     //   onSelect && onSelect();
  //     //   return;
  //     case "edit":
  //       setEdited(operation);
  //       onClose();
  //       disclosure.onOpen();
  //       return;
  //     case "delete":
  //       onDelete ? onDelete(operation.id) : setDeleted(operation);
  //       onClose();
  //       return;
  //     default:
  //       return;
  //   }
  // };

  async function handleDelete() {
    const { error } = await deleteRows([operation.id], type);
    if (error) {
      // toast
    } else {
      onDelete?.();
    }
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
          <DropdownMenuItem className="group pr-4">
            <SquarePenIcon size={14} className="mx-1" />
            <div className="flex flex-col">
              <span>{dict.menu.edit.title}</span>
              <span className="text-xs text-muted-foreground transition-colors duration-100 group-hover:text-foreground">
                {dict.menu.edit.description}
              </span>
            </div>
          </DropdownMenuItem>
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
      {/* <Dropdown
        shadow="sm"
        placement="left"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DropdownTrigger>
          <button className="h-6 w-6 -my-2 rounded-full grid place-content-center ml-auto">
            <MoreVerticalIcon size={20} />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          disabledKeys={[]}
          variant="faded"
          aria-label="Dropdown menu with description"
          onAction={onAction}
        >
          <DropdownItem
            key="edit"
            description={dict.menu.edit.description}
            startContent={<SquarePenIcon size={16} />}
            closeOnSelect={false}
            showDivider
          >
            {dict.menu.edit.title}
          </DropdownItem>
          <DropdownItem
            closeOnSelect={false}
            key="delete"
            className="text-danger"
            color="danger"
            description={dict.menu.delete.description}
            startContent={<Trash2Icon className="text-danger" size={16} />}
          >
            {dict.menu.delete.title}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
      {/* <EditModal
        dict={dict.modal.edit}
        edited={edited}
        setEdited={setEdited}
        type={type}
        onEdit={onEdit}
        {...disclosure}
      /> */}
      {/* {!onDelete && (
        <DeleteModal
          dict={dict.modal.delete}
          type={type}
          deleted={deleted ? [deleted] : []}
          onClose={() => setDeleted(null)}
        />
      )} */}
    </Fragment>
  );
}
