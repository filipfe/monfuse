import Timeline from "@/components/recurring-payments/timeline/timeline";
import Latest from "@/components/recurring-payments/latest/list";
import Upcoming from "@/components/recurring-payments/upcoming/list";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import RecurringPaymentsTable from "@/components/recurring-payments/active/table";
import Calendar from "@/components/recurring-payments/calendar";

export default async function Page() {
  const settings = await getSettings();
  const { private: dict } = await getDictionary(settings.language);

  return (
    <div className="h-full sm:px-10 py-4 sm:py-8 flex flex-col 2xl:grid grid-cols-[1fr_600px] 2xl:grid-rows-[max-content_1fr] gap-4 sm:gap-6">
      {/* <Timeline timezone={settings.timezone} /> */}
      <RecurringPaymentsTable settings={settings} />
      {/* <Upcoming timezone={settings.timezone} /> */}
      <Calendar settings={settings} />
      <Latest settings={settings} />
    </div>
  );
}
