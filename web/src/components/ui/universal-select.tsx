"use client";

import { Select, SelectItem, SelectProps } from "@heroui/react";

type Props = Omit<SelectProps, "children"> & {
  elements: string[] | Option<string>[];
};

export default function UniversalSelect(props: Props) {
  return (
    // <Select>
    //   <SelectTrigger>
    //     <SelectValue />
    //   </SelectTrigger>
    //   <SelectContent>
    //     {elements.map((element) => (
    //       <SelectItem
    //         value={typeof element === "string" ? element : element.value}
    //         key={typeof element === "string" ? element : element.value}
    //       >
    //         {typeof element === "string"
    //           ? element
    //           : element.label || element.name}
    //       </SelectItem>
    //     ))}
    //   </SelectContent>
    // </Select>
    <Select
      classNames={{
        trigger: "bg-light shadow-none border",
      }}
      disallowEmptySelection
      {...props}
    >
      {props.elements.map((element) => (
        <SelectItem
          // value={typeof element === "string" ? element : element.value}
          classNames={{
            base: "!bg-white hover:!bg-light",
          }}
          key={typeof element === "string" ? element : element.value}
        >
          {typeof element === "string"
            ? element
            : element.label || element.name}
        </SelectItem>
      ))}
    </Select>
  );
}
