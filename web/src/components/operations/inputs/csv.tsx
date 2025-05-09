import Dropzone from "@/components/ui/dropzone";
import parseCSV from "@/utils/operations/parse-csv";
import { Hatch } from "ldrs/react";
import { FileSpreadsheet } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type Props<T> = {
  type: OperationType;
  formatter: (data: string[][]) => T[];
  setRecords: Dispatch<SetStateAction<T[]>>;
};

export default function CSVInput<T>({ type, formatter, setRecords }: Props<T>) {
  const [isLoading, setIsLoading] = useState(false);

  const onChange = async (files: File[]) => {
    setIsLoading(true);
    await Promise.all(
      files.map((file) => async () => {
        await parseCSV(
          file,
          (results) => setRecords((prev) => [...prev, ...formatter(results)]),
          {
            type,
          }
        );
      })
    );
    setIsLoading(false);
  };

  return (
    <Dropzone
      id="csv-input"
      allowedTypes={[
        ".csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]}
      onChange={onChange}
    >
      {isLoading ? (
        <Hatch size="28" stroke="4" speed="3.5" color="black" />
      ) : (
        <>
          <FileSpreadsheet size={28} />
          <p className="text-sm">Dodaj lub upuść pliki</p>
        </>
      )}
    </Dropzone>
  );
}
