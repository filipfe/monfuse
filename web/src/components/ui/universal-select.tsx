"use client";

import { SelectProps } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Props = Omit<SelectProps, "children"> & {
  elements: string[] | Option<string>[];
  placeholder?: string;
  label?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  required?: boolean;
};

export default function UniversalSelect({
  elements,
  label,
  placeholder,
  className,
  size,
  required,
  ...props
}: Props) {
  return (
    <Select {...props}>
      <SelectTrigger
        className={className}
        label={label}
        size={size}
        required={required}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {elements.map((element) => (
          <SelectItem
            value={typeof element === "string" ? element : element.value}
            key={typeof element === "string" ? element : element.value}
          >
            {typeof element === "string"
              ? element
              : element.label || element.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    // <Select
    //   classNames={{
    //     trigger: "bg-light shadow-none border",
    //   }}
    //   disallowEmptySelection
    //   {...props}
    // >
    //   {props.elements.map((element) => (
    //     <SelectItem
    //       // value={typeof element === "string" ? element : element.value}
    //       classNames={{
    //         base: "!bg-white hover:!bg-light",
    //       }}
    //       key={typeof element === "string" ? element : element.value}
    //     >
    //       {typeof element === "string"
    //         ? element
    //         : element.label || element.name}
    //     </SelectItem>
    //   ))}
    // </Select>
  );
}
