"use client";

import { CURRENCIES } from "@/const";
import { Dict } from "@/const/dict";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../select";

interface Props extends State {
  dict: Dict["private"]["operations"]["operation-table"]["top-content"]["filter"]["currency"];
}

export default function CurrencySelect({ dict, onChange, value }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger label={dict.label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="*">{dict.default}</SelectItem>
        {CURRENCIES.map((curr) => (
          <SelectItem value={curr} key={curr}>
            {curr}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
