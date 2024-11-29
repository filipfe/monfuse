import Latest from "@/components/recurring-payments/latest/list";
import Upcoming from "@/components/recurring-payments/upcoming/list";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Metadata } from "next";
import Providers from "./providers";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const {
    private: { operations: dict },
  } = await getDictionary(settings.language);
  return dict["recurring-payments"]._metadata;
}

export default async function Page() {
  const settings = await getSettings();
  const {
    private: { operations },
  } = await getDictionary(settings.language);
  const dict = operations["recurring-payments"];

  return (
    <div className="h-full sm:px-10 py-4 sm:py-8 flex flex-col 2xl:grid grid-cols-[1fr_600px] 2xl:grid-rows-[repeat(2,max-content)_1fr] gap-4 sm:gap-6">
      <Upcoming timezone={settings.timezone} dict={dict.upcoming} />
      <Providers settings={settings} dict={dict} />
      <Latest settings={settings} dict={dict.latest} />
    </div>
  );
}
