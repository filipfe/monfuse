import RecurringPaymentsTable from "@/components/recurring-payments/table";
import Timeline from "@/components/recurring-payments/timeline/timeline";
import Upcoming from "@/components/recurring-payments/upcoming/list";
import BalanceByMonth from "@/components/stats/balance-by-month";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";

export default async function Page() {
  const settings = await getSettings();
  const {
    private: {
      general: { incomes, expenses },
      stats: dict,
    },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col lg:grid grid-cols-5 gap-4 sm:gap-6">
      <Timeline />
      <RecurringPaymentsTable />
      <Upcoming />
      {/* <Suspense fallback={<Loader />}>
        <Upcoming languageCode={settings.language} />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <ActiveRecurringPaymentsList page={searchParams.page} />
      </Suspense>
      <Timeline /> */}
    </div>
  );
}
