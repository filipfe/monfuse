import { Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import Add from "../cta/add";

import Filter from "./filter";
import { DebouncedState } from "use-debounce";
import PeriodSelect from "./period-select";
import Delete from "../cta/delete";
import { Dict } from "@/const/dict";

type Props = FilterProps & {
  dict: Dict["private"]["operations"]["operation-table"]["top-content"];
  search?: string;
  handleSearch: DebouncedState<(search?: string) => void>;
  type: OperationType;
  deletionCallback?: () => void;
  selected?: string[];
  addHref?: string;
  showPeriodFilter?: boolean;
  viewOnly?: boolean;
};

export default function TopContent({
  dict,
  type,
  search,
  state,
  selected,
  addHref,
  deletionCallback,
  handleSearch,
  showPeriodFilter,
}: // viewOnly,
Props) {
  return (
    <div className="flex-1 flex items-center justify-between gap-4 sm:gap-8">
      <Input
        isClearable
        size="sm"
        className="max-w-[24rem]"
        radius="md"
        classNames={{
          inputWrapper: "!h-9 shadow-none border",
        }}
        placeholder={dict.search.placeholder}
        startContent={<SearchIcon size={16} className="mx-1" />}
        defaultValue={search}
        onValueChange={handleSearch}
      />
      <div className="items-center gap-3 flex">
        {selected && selected.length > 0 && (
          <Delete
            callback={deletionCallback}
            items={selected}
            type={type as OperationType}
          />
        )}
        {showPeriodFilter && <PeriodSelect dict={{ reset: dict.reset }} />}
        <Filter
          dict={{ reset: dict.reset, ...dict.filter }}
          enabled={{
            label: type === "expense",
            currency: true,
            transaction: type === "stock",
          }}
          state={state}
        />
        {addHref && (
          <div className="hidden sm:block">
            <Add title={dict.add} size="sm" href={addHref} className="!h-10" />
          </div>
        )}
      </div>
    </div>
  );
}
