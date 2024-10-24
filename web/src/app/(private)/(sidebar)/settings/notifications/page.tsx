import NotificationSwitch from "@/components/settings/inputs/notification";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";

export default async function Page() {
  const settings = await getSettings();
  const {
    private: {
      settings: { notifications: dict },
    },
  } = await getDictionary(settings.language);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 lg:gap-0 lg:grid grid-cols-2 2xl:grid-cols-3">
        <div className="lg:pr-8">
          <NotificationSwitch dict={dict} field="telegram" />
        </div>
        <div className="lg:pl-8 border-l">
          <NotificationSwitch dict={dict} field="email" />
        </div>
      </div>
    </div>
  );
}
