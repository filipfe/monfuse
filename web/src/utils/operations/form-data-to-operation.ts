import { format } from "date-fns";

export default function formDataToOperation(
  formData: FormData,
  id: string,
): Operation {
  const operation: Operation = {
    id,
    title: formData.get("title")?.toString() || "",
    amount: formData.get("amount")?.toString() || "",
    issued_at: formData.get("issued_at")?.toString() ||
      format(new Date(), "yyyy-MM-dd"),
    currency: formData.get("currency")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    label: formData.get("label")?.toString(),
    doc_path: "",
  };

  return operation;
}
