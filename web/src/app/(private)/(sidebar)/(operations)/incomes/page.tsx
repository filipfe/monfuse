import OperationTable from "@/components/operations/table";
import { getOperationsStats } from "@/lib/operations/actions";
import Providers from "../providers";
import OperationsByMonth from "@/components/operations/operations-by-month";
import Stat from "@/components/ui/stat-ref";
import { getSettings } from "@/lib/general/actions";
import getDictionary from "@/const/dict";
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
      general: { incomes: title },
    },
  } = await getDictionary(settings.language);

  const { result } = await getOperationsStats(
    settings.timezone,
    settings.currency,
    "income"
  );

  if (!result) {
    throw new Error("Wystąpił błąd, spróbuj ponownie!");
  }

  const { last_month, last_day } = result;

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 sm:grid grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-[max-content_1fr]">
      <div className="col-[1/2]">
        <Stat
          title={dict.stats["today"]}
          currency={settings.currency}
          stat={last_day}
        />
      </div>
      <div className="col-[2/3]">
        <Stat
          title={dict.stats["30-days"]}
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
        <div className="col-[1/3] row-[2/3] flex flex-col order-last">
          <OperationsByMonth
            type="income"
            settings={settings}
            title={title}
            dict={dict["operations-by-month"]}
          />
        </div>
        <div className="row-span-2 col-span-2 flex items-stretch">
          <OperationTable
            title={title}
            type="income"
            settings={settings}
            dict={dict["operation-table"]}
          />
        </div>
      </Providers>
    </div>
  );
}
