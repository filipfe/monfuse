"use client";

import Dropzone from "@/components/ui/dropzone";
import { createClient } from "@/utils/supabase/client";
import toast from "@/utils/toast";
import { Hatch } from "ldrs/react";
import { ScanLineIcon } from "lucide-react";
import {
  Dispatch,
  DragEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { v4 } from "uuid";

type Props = {
  description: string;
  type: OperationType;
  setRecords: Dispatch<SetStateAction<Operation[]>>;
};

export default function Scan({ description, type, setRecords }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const onChange = async (files: File[]) => {
    setIsLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(v4(), file);
    });
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("process-receipt", {
      body: formData,
    });
    if (error) {
      // toast
    } else if (data) {
      setRecords((prev) => [...prev, ...data.operations]);
    }
    setIsLoading(false);
  };

  return (
    <Dropzone
      id="scan-input"
      allowedTypes={["image/png", "image/jpeg"]}
      onChange={onChange}
      className={type === "expense" ? "h-[242px]" : "h-[310px]"}
    >
      {isLoading ? (
        <Hatch size="28" stroke="4" speed="3.5" color="black" />
      ) : (
        <>
          <ScanLineIcon size={28} />
          <p className="text-sm">{description}</p>
        </>
      )}
    </Dropzone>
  );
}
