"use client";

import Autocomplete from "@/components/ui/autocomplete";
import { Dict } from "@/const/dict";
import { useLabels } from "@/lib/operations/queries";
import { useEffect, useState } from "react";

type Props = {
  dict: {
    placeholder: string;
    label: string;
    description: string;
  };
  defaultValue?: string | null;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export default function LabelInput({
  dict,
  defaultValue,
  value,
  onChange,
  disabled,
}: Props) {
  const [label, setLabel] = useState(defaultValue || "");
  const { data: labels } = useLabels();

  useEffect(() => {
    if (value === undefined) return;
    setLabel(value);
  }, [value]);

  return (
    <div className="relative flex items-center">
      <Autocomplete
        disabled={disabled}
        value={label}
        placeholder={dict.placeholder}
        label={dict.label}
        onChange={(value) => {
          setLabel(value);
          onChange?.(value);
        }}
        items={
          labels?.map((label) => ({
            value: label.name,
            label: label.name,
            description: `${label.count} ${dict.description}`,
          })) || []
        }
      />
    </div>
  );
}
