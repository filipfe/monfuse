import Timeline from "@/components/recurring-payments/timeline/timeline";
import Latest from "@/components/recurring-payments/latest/list";
import Upcoming from "@/components/recurring-payments/upcoming/list";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import RecurringPaymentsTable from "@/components/recurring-payments/active/table";

export default async function Page() {
  const settings = await getSettings();
  const { private: dict } = await getDictionary(settings.language);

  return (
    <div className="h-full sm:px-10 py-4 sm:py-8 flex flex-col lg:grid grid-cols-5 gap-4 sm:gap-6">
      <Timeline timezone={settings.timezone} />
      <RecurringPaymentsTable />
      <div className="grid gap-4 sm:gap-6 col-span-2">
        <Upcoming timezone={settings.timezone} />
        <Latest />
      </div>
    </div>
  );
}
