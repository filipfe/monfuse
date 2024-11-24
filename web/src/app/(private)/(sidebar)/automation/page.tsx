import LatestOperations from "@/components/automation/latest-operations";
import TelegramBot from "@/components/automation/telegram-bot";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const {
    private: {
      automation: { _metadata },
    },
  } = await getDictionary(settings.language);
  return _metadata;
}

export default async function Page() {
  const settings = await getSettings();

  const {
    private: { automation: dict },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex md:items-center justify-center">
      <TelegramBot dict={dict} settings={settings}>
        <LatestOperations
          dict={dict["latest-operations"]}
          languageCode={settings.language}
        />
      </TelegramBot>
    </div>
  );
}
