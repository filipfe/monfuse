"use client";

import { TRANSACTION_TYPES } from "@/const";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

interface Props extends State {
  dict: {
    label: string;
    default: string;
  };
}

export default function TransactionSelect({ onChange, value, dict }: Props) {
  return (
    <Select name="transaction" value={value} onValueChange={onChange}>
      <SelectTrigger label={dict.label} size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="*">{dict.default}</SelectItem>

        {TRANSACTION_TYPES.map((type) => (
          <SelectItem value={type.value} key={type.value}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
