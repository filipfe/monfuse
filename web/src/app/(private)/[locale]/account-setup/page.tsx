import AccountSetupForm from "@/components/account-setup/form";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import getLang from "@/utils/get-lang";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const lang = getLang(params.locale);
  const { private: dict } = await getDictionary(lang);
  return dict["account-setup"]._metadata;
}

export default async function AccountSetup({
  params,
}: {
  params: { locale: Locale };
}) {
  const settings = await getSettings();

  const lang = getLang(params.locale);

  const { private: dict } = await getDictionary(settings.language || lang);

  return (
    <div className="h-screen sm:h-auto min-h-screen sm:px-10 py-4 sm:py-8 flex items-center justify-center">
      <div className="mx-auto w-full max-w-xl flex flex-col gap-4 sm:gap-6">
        <AccountSetupForm
          settings={settings}
          dict={dict}
          locale={params.locale}
        />
      </div>
    </div>
  );
}
