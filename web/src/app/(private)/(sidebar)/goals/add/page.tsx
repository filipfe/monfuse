import GoalForm from "@/components/goals/form";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const {
    private: {
      goals: { _metadata },
    },
  } = await getDictionary(settings.language);
  return _metadata;
}

export default async function Page() {
  const settings = await getSettings();

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <GoalForm defaultCurrency={settings.currency} />
    </div>
  );
}
