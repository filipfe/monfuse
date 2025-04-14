"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Dispatch, FormEvent, SetStateAction, useEffect } from "react";
import Manual from "../inputs/manual";
import { updateOperation } from "@/lib/operations/actions";
import formDataToOperation from "@/utils/operations/form-data-to-operation";
import Form from "@/components/ui/form";
import { Dict } from "@/const/dict";
import { useSettings } from "@/lib/general/queries";
import dateFormat from "@/utils/formatters/dateFormat";

interface Props extends ReturnType<typeof useDisclosure> {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"]["modal"]["edit"];
  edited: Operation | null;
  setEdited: Dispatch<SetStateAction<Operation | null>>;
  type: OperationType;
  onEdit?: (updated: Operation) => void;
}

export default function EditModal({
  dict,
  type,
  edited,
  onEdit,
  setEdited,
  isOpen,
  onClose,
  onOpenChange,
}: Props) {
  const { data: settings } = useSettings();

  if (!edited) return;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!onEdit) return;
    const formData = new FormData(e.target as HTMLFormElement);
    onEdit(formDataToOperation(formData, edited.id) as Operation);
    onClose();
  };

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => setEdited(null)}
    >
      <ModalContent>
        <ModalHeader className="font-normal">
          <span>
            {dict.title[type as "income" | "expense"]}{" "}
            <span className="font-bold">{edited.title}</span>
          </span>
        </ModalHeader>
        <Form
          id="edit-modal"
          buttonWrapperClassName="pb-6 px-6"
          mutation={
            onEdit
              ? undefined
              : (data) =>
                  updateOperation(
                    data,
                    settings?.timezone || "UTC",
                    dateFormat(
                      edited.issued_at,
                      settings?.timezone || "UTC",
                      "yyyy-MM-dd"
                    )
                  )
          }
          onSubmit={onEdit ? onSubmit : undefined}
          close={{ onClose, text: dict.form._close.label }}
          successMessage={dict.form._success}
          callback={onClose}
          buttonProps={{
            children: dict.form._submit.label,
          }}
        >
          <ModalBody className="relative flex items-center justify-center min-h-48 py-0 [&:has(+button)]:z-40 my-3">
            {edited && (
              <Manual
                dict={dict.form}
                timezone={settings?.timezone}
                withLabel={!onEdit}
                initialValue={edited}
                type={type}
              />
            )}
          </ModalBody>
        </Form>
      </ModalContent>
    </Modal>
  );
}
