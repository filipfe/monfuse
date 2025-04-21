"use client";

import { ScanTextIcon, WrenchIcon } from "lucide-react";
import { useState } from "react";
import { addOperations } from "@/lib/operations/actions";
import Block from "../ui/block";
import Scan from "./inputs/scan";
import Manual from "./inputs/manual";
import LabelInput from "./inputs/label";
import PreviewTable from "./preview-table";
import Form from "../ui/temp-form";
import { Dict } from "@/const/dict";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type Props = {
  type: OperationType;
  settings: Settings;
  dict: {
    add: Dict["private"]["operations"]["add"];
    table: Dict["private"]["operations"]["operation-table"];
  };
};

export default function AddForm({ dict, type, settings }: Props) {
  const [records, setRecords] = useState<Operation[]>([]);

  return records.length > 0 ? (
    <PreviewTable
      title={dict.add.tab.scan.title}
      dict={{ ...dict.table, ...dict.add.tab.scan.table }}
      rows={records}
      count={records.length}
      setRows={setRecords as any}
      settings={settings}
    >
      <Form
        mutation={(data) => addOperations(data, settings.timezone)}
        successMessage={dict.add.form._success}
        buttonProps={{ children: dict.add.form._submit }}
      >
        <div className="flex flex-col justify-end h-full mt-6">
          {type === "expense" && (
            <LabelInput dict={dict.table.dropdown.modal.edit.form.label} />
          )}
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="data" value={JSON.stringify(records)} />
        </div>
      </Form>
    </PreviewTable>
  ) : (
    <Block
      title={dict.add.title[type as "income" | "expense"]}
      description={dict.add.description[type as "income" | "expense"]}
      className="max-w-3xl w-full mx-auto"
    >
      <Tabs defaultValue="manual">
        <TabsList className="mb-2">
          <TabsTrigger value="manual">
            <WrenchIcon size={16} opacity={0.8} />
            {dict.add.tab.manual.title}
          </TabsTrigger>
          <TabsTrigger value="scan">
            <ScanTextIcon size={16} opacity={0.8} />
            {dict.add.tab.scan.title}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <Form
            mutation={(data) => addOperations(data, settings.timezone)}
            id="add-form"
            buttonProps={{ form: "add-form", children: dict.add.form._submit }}
            successMessage={dict.add.form._success}
          >
            <Manual
              dict={dict.table.dropdown.modal.edit.form}
              withLabel={type === "expense"}
              type={type}
              defaultCurrency={settings.currency}
              timezone={settings.timezone}
            />
          </Form>
        </TabsContent>
        <TabsContent value="scan">
          <Scan
            description={dict.add.tab.scan.description}
            type={type}
            setRecords={setRecords}
          />
        </TabsContent>
      </Tabs>
    </Block>
  );
}

//  <Tab
//           key="csv"
//           title={
//             <div className="flex items-center gap-2">
//               <FileSpreadsheetIcon size={16} opacity={0.8} />
//               <span>Import CSV</span>
//             </div>
//           }
//         >
//           <CSVInput
//             type={type}
//             setRecords={setRecords}
//             formatter={operationFormatter}
//           />
//         </Tab>
