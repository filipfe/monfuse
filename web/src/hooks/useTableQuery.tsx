import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { DebouncedState, useDebouncedCallback } from "use-debounce";

type UseTableQuery<T> = {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  searchQuery: SearchParams;
  handleSearch: DebouncedState<(value: string) => void>;
  changeFilter: <K extends keyof SearchParams>(
    key: K,
    value: SearchParams[K]
  ) => void;
};

export default function useTableQuery<T>(): UseTableQuery<T> {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<T[]>([]);
  const [searchQuery, setSearchQuery] = useState<SearchParams>({
    page: 1,
    sort: "",
    search: "",
    label: searchParams.get("label") || "",
    currency: searchParams.get("currency") || "",
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery((prev) => ({
      ...prev,
      page: 1,
      search: value,
    }));
  }, 300);

  const changeFilter = <K extends keyof SearchParams>(
    key: K,
    value: SearchParams[K]
  ) => {
    switch (key) {
      case "page":
        setSearchQuery((prev) => ({ ...prev, [key]: value }));
        break;
      default:
        setSearchQuery((prev) => ({ ...prev, page: 1, [key]: value }));
    }
  };

  // useEffect(() => {
  //   if (options?.viewOnly) return;
  //   const params = new URLSearchParams();
  //   const query = { ...searchQuery, ...(options?.period || {}) };
  //   Object.keys(query).forEach((key) => {
  //     const value = query[key as keyof typeof searchQuery];
  //     value && params.set(key, String(value));
  //   });
  //   router.push(`${pathname}?${params.toString()}`, { scroll: false });
  // }, [searchQuery, options]);

  // useEffect(() => {
  //   if (!options?.viewOnly) return;
  //   const start = ((searchQuery.page || 1) - 1) * 10;
  //   const end = start + 10;
  //   return setItems(rows.slice(start, end));
  // }, [rows, options?.viewOnly, searchQuery.page]);

  return {
    items,
    setItems,
    searchQuery,
    changeFilter,
    handleSearch,
  };
}
