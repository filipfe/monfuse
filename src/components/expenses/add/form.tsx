"use client";

import { ADD_METHODS } from "@/const";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import { CheckIcon, EyeIcon, PaperclipIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import Papa from "papaparse";
import { addExpenses } from "@/lib/expenses/actions";

export default function ExpenseForm() {
  const [method, setMethod] = useState<AddMethodKey>("csv");
  const [fileName, setFileName] = useState("");
  const [records, setRecords] = useState<string[][]>([]);
  const [singleRecord, setSingleRecord] = useState<Expense>({
    title: "",
    issued_at: "",
    amount: "",
    currency: "",
    description: "",
  });

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setFileName(file.name);
    Papa.parse(file as any, {
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) return;
        // const results = (data as string[][]).map((record) => {
        //   const [
        //     issued_at,
        //     currency_date,
        //     title,
        //     amount,
        //     currency,
        //     budget_after,
        //     description,
        //   ] = record;
        //   return {
        //     issued_at,
        //     currency_date,
        //     title,
        //     amount,
        //     currency,
        //     budget_after,
        //     description,
        //   };
        // });
        setRecords(data as string[][]);
      },
    });
  };

  return (
    <div className="grid grid-cols-2 gap-8 mt-8">
      <form
        className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col"
        action={addExpenses}
      >
        <h2 className="text-lg">Dane</h2>
        <RadioGroup
          label="Wybierz sposób"
          value={method}
          onChange={(e) => setMethod(e.target.value as AddMethodKey)}
        >
          {ADD_METHODS.map(({ title, type }) => (
            <Radio value={type} key={type}>
              {title}
            </Radio>
          ))}
        </RadioGroup>
        {method === "csv" ? (
          <label
            className="flex items-center gap-2 text-primary cursor-pointer opacity-80 hover:opacity-80 transition-opacity"
            htmlFor="csv-file"
          >
            <PaperclipIcon className="mt-0.5" size={16} />
            <span>{fileName || "Dodaj plik"}</span>
            <input
              type="file"
              id="csv-file"
              name="csv-file"
              required
              className="opacity-0 -z-50 pointer-events-none absolute"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={onFileChange}
            />
          </label>
        ) : (
          <div className="grid grid-cols-2 gap-4 my-4">
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="title"
              label="Tytuł"
              placeholder="Wynagrodzenie"
              isRequired
              value={singleRecord.title}
              onChange={(e) =>
                setSingleRecord((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="amount"
              label="Kwota"
              placeholder="3600"
              isRequired
              value={singleRecord.amount}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/\D/g, "");
                setSingleRecord((prev) => ({
                  ...prev,
                  amount: value,
                }));
              }}
            />
            <Autocomplete
              label="Waluta"
              placeholder="PLN"
              isClearable={false}
              isRequired
              value={singleRecord.currency}
              onChange={(e) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  currency: e.target.value,
                }))
              }
              inputProps={{
                classNames: {
                  inputWrapper: "!bg-light",
                },
              }}
            >
              <AutocompleteItem
                classNames={{
                  base: "!bg-white hover:!bg-light",
                }}
                key="usd"
              >
                USD
              </AutocompleteItem>
            </Autocomplete>
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="issued_at"
              label="Data uiszczenia"
              placeholder="24.01.2024"
              isRequired
              value={singleRecord.issued_at}
              onChange={(e) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  issued_at: e.target.value,
                }))
              }
            />
            <Textarea
              className="col-span-2"
              classNames={{ inputWrapper: "!bg-light" }}
              name="number"
              label="Opis"
              placeholder="Wynagrodzenie za luty"
              value={singleRecord.description}
              onChange={(e) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        )}
        <input type="hidden" name="type" value={method} />
        <div className="flex-1 flex justify-end items-end gap-4">
          <div></div>
          <Button color="primary" className="h-9 text-white">
            <CheckIcon className="mt-0.5" size={16} /> Zapisz
          </Button>
        </div>
      </form>
      <div className="bg-white rounded-lg px-10 py-8 flex flex-col gap-4">
        <h2 className="text-lg">Podgląd</h2>
        {Object.keys(singleRecord).some(
          (key) => singleRecord[key as keyof Expense]
        ) ? (
          <div></div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 w-full self-center max-w-[16rem]">
            <EyeIcon size={48} strokeWidth={1} />
            <p className="text-sm">
              Wypełnij formularz, aby zobaczyć podgląd swoich wydatków
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
