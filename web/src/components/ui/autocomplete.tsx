import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { CSSProperties, useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";
import { Input } from "./input";
import { Popover, PopoverAnchor, PopoverContent } from "./popover";
import { Skeleton } from "./skeleton";
import { cn } from "@/utils/cn";

type Props<T extends string> = {
  value?: string;
  onChange?: (value: string) => void;
  items: { value: T; label: string; description?: string }[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
};

export default function Autocomplete<T extends string>({
  value: initialValue,
  onChange,
  items,
  isLoading,
  label,
  emptyMessage = "No items.",
  placeholder = "Search...",
  disabled,
}: Props<T>) {
  const [value, setValue] = useState(initialValue || "");
  const [open, setOpen] = useState(false);

  const onSelectItem = (inputValue: string) => {
    setValue(inputValue);
    onChange?.(inputValue);
    setOpen(false);
  };

  const matchingValues = useMemo(
    () =>
      items.filter((item) =>
        item.value.toLowerCase().includes(value.toLowerCase())
      ),
    [items, value]
  );

  return (
    <div className="flex items-center w-full">
      <Popover open={open && matchingValues.length > 0} onOpenChange={setOpen}>
        <Command className="w-full" shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              disabled={disabled}
              asChild
              value={value}
              onValueChange={(v) => {
                setValue(v);
                onChange?.(v);
              }}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!value || !open)}
              onFocus={() => setOpen(true)}
            >
              <Input placeholder={placeholder} label={label} />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            style={{
              width: "--radix-popover-trigger-width",
            }}
            className="p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-foreground/75">
                            {option.description}
                          </span>
                        )}
                      </div>
                      {value === option.value && <Check size={16} />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
