import toast from "@/utils/toast";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useTransition } from "react";

type Props = {
  dict: { title: string; description: string; proceed: string; cancel: string };
  disclosure: ReturnType<typeof useDisclosure>;
  mutation: (formData: FormData) => Promise<{ error?: string } | undefined>;
  successMessage?: string;
  onSuccess?: () => void;
  children?: React.ReactNode;
};

export default function ConfirmationModal({
  disclosure,
  dict,
  children,
  onSuccess,
  mutation,
  successMessage,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await mutation(formData);
      if (res?.error) {
        toast({
          type: "error",
          message: "Something went wrong!",
        });
      } else {
        onSuccess && onSuccess();
        disclosure.onClose();
        successMessage &&
          toast({
            type: "success",
            message: successMessage,
          });
      }
    });

  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        <ModalHeader>{dict.title}</ModalHeader>
        <ModalBody>
          <p className="text-sm text-center">{dict.description}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            disableRipple
            onPress={disclosure.onClose}
            className="bg-light border"
          >
            {dict.cancel}
          </Button>
          <form action={action}>
            {children}
            <Button
              type="submit"
              disableRipple
              isDisabled={isPending}
              color="primary"
            >
              {dict.proceed}
            </Button>
          </form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
