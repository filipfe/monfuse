import { MoreVerticalIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Fragment, Key, useState } from "react";
import EditModal from "./modals/edit-modal";
import DeleteModal from "./modals/delete-modal";
import { Dict } from "@/const/dict";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"];
  operation: Operation;
  // onSelect?: () => void;
  onEdit?: (updated: Operation) => void;
  onDelete?: (id: string) => void;
  type: OperationType;
};

export default function ActionsDropdown({
  dict,
  operation,
  type,
  onEdit,
  // onSelect,
  onDelete,
}: Props) {
  const [edited, setEdited] = useState<Operation | null>(null);
  const [deleted, setDeleted] = useState<Operation | null>(null);

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
          <DropdownMenuItem className="group pr-4">
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
      {!onDelete && (
        <DeleteModal
          dict={dict.modal.delete}
          type={type}
          deleted={deleted ? [deleted] : []}
          onClose={() => setDeleted(null)}
        />
      )}
    </Fragment>
  );
}
