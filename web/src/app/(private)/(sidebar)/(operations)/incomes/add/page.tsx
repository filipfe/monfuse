import AddForm from "@/components/operations/form";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const {
    private: {
      operations: {
        incomes: { _metadata },
      },
    },
  } = await getDictionary(settings.language);
  return _metadata;
}

export default async function Page() {
  const settings = await getSettings();

  const {
    private: {
      operations: { "operation-table": dictTable, add: dict },
    },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <AddForm
        dict={{ table: dictTable, add: dict }}
        type="income"
        settings={settings}
      />
    </div>
  );
}
