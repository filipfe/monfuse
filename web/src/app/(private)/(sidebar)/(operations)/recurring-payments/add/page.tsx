import RecurringPaymentForm from "@/components/recurring-payments/form";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Metadata } from "next";

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
    private: { operations: dict },
  } = await getDictionary(settings.language);
  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <RecurringPaymentForm
        settings={settings}
        dict={dict["recurring-payments"].add}
      />
    </div>
  );
}
