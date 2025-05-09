import OperationTable from "@/components/operations/table";
import Stat from "@/components/ui/stat-ref";
import { getOperationsStats } from "@/lib/operations/actions";
import Providers from "../providers";
import OperationsByMonth from "@/components/operations/operations-by-month";
import Limits from "@/components/operations/limits";
import { getSettings } from "@/lib/general/actions";
import getDictionary, { Dict } from "@/const/dict";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const {
    private: {
      operations: {
        expenses: { _metadata },
      },
    },
  } = await getDictionary(settings.language);
  return _metadata;
}

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await searchParamsPromise;
  const settings = await getSettings();

  const {
    private: {
      operations: dict,
      general: { expenses: title },
    },
  } = await getDictionary(settings.language);

  const { result } = await getOperationsStats(
    settings.timezone,
    settings.currency,
    "expense"
  );

  if (!result) {
    throw new Error("Failed to fetch the resource!");
  }

  const { last_month, last_day } = result;

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-[max-content_max-content_1fr]">
      <Limits dict={dict.expenses.limits} settings={settings} />
      <div className="col-[1/2]">
        <Stat
          title={dict.stats["today"]}
          description=""
          currency={settings.currency}
          stat={last_day}
        />
      </div>
      <div className="col-[2/3]">
        <Stat
          title={dict.stats["30-days"]}
          description=""
          currency={settings.currency}
          stat={last_month}
        />
      </div>
      <Providers
        defaultPeriod={{
          from: searchParams.from || "",
          to: searchParams.to || "",
        }}
      >
        <div className="col-start-1 col-end-3 row-start-3 row-end-3 flex flex-col order-last">
          <OperationsByMonth
            type="expense"
            settings={settings}
            title={title}
            dict={dict["operations-by-month"]}
          />
        </div>
        {/* <Suspense fallback={<Loader className="row-span-3 col-span-2" />}>
          <Expenses
            searchParams={searchParams}
            settings={settings}
            title={title}
            dict={dict["operation-table"]}
          />
        </Suspense> */}
        <div className="row-span-2 col-span-2 flex items-stretch">
          <OperationTable
            title={title}
            type="expense"
            settings={settings}
            dict={dict["operation-table"]}
          />
        </div>
      </Providers>
    </div>
  );
}
