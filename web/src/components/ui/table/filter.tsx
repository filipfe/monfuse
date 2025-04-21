import { ListFilterIcon, ListRestartIcon } from "lucide-react";
import CurrencySelect from "./currency-select";
import LabelSelect from "./label-select";
import { Dict } from "@/const/dict";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";

interface Props extends FilterProps {
  dict: {
    reset: string;
  } & Dict["private"]["operations"]["operation-table"]["top-content"]["filter"];
}

export default function Filter({
  dict,
  enabled = { label: false, currency: true, transaction: false },
  state,
}: Props) {
  const numberOfParams = Object.keys(state).filter(
    (key) => state[key as keyof typeof state]?.value !== "*"
  ).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10 relative">
          <ListFilterIcon size={16} />
          {numberOfParams > 0 && (
            <div className="absolute w-6 h-6 text-sm border-2 border-white bg-primary flex items-center justify-center text-primary-foreground rounded-full -right-2 -top-2">
              {numberOfParams}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] py-1.5 px-3">
        <div className="flex flex-col gap-2 py-2 w-full">
          {enabled.label && state.label && (
            <LabelSelect dict={dict.label} {...state.label} />
          )}
          {enabled.currency && state.currency && (
            <CurrencySelect dict={dict.currency} {...state.currency} />
          )}
          {/* {enabled.transaction && state.transaction && (
            <TransactionSelect {...state.transaction} />
          )} */}
          {numberOfParams > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                Object.keys(state).forEach((key) => {
                  const value = state[key as keyof typeof state];
                  value && value.onChange("");
                });
              }}
            >
              <ListRestartIcon size={15} strokeWidth={2} /> {dict.reset}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
