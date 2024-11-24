import CurrencySelect from "@/components/settings/inputs/currency";
import InsertSubscriptionExpenseSwitch from "@/components/settings/inputs/insert-subscription-expense";
import LocationInput from "@/components/settings/inputs/location";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const {
    private: {
      settings: {
        preferences: { _metadata },
      },
    },
  } = await getDictionary(settings.language);
  return _metadata;
}

export default async function Preferences() {
  const settings = await getSettings();

  const {
    private: {
      settings: { preferences: dict },
    },
  } = await getDictionary(settings.language);

  return (
    <div className="flex flex-col gap-8 lg:gap-0 lg:grid grid-cols-3">
      <div className="lg:pr-8 grid gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mb-2">
            <h3>{dict["default-currency"].title}</h3>
            <p className="text-sm text-font/60">
              {dict["default-currency"].description}
            </p>
          </div>
          <CurrencySelect
            dict={{
              ...dict["default-currency"].select,
              _success: dict._success,
            }}
            defaultValue={settings.currency}
          />
        </div>
        <LocationInput
          dict={{ ...dict.location, _success: dict._success }}
          settings={settings}
        />
      </div>
      <div className="lg:pl-8 lg:border-l">
        <InsertSubscriptionExpenseSwitch
          dict={dict["insert-subscription-expense"]}
        />
      </div>
    </div>
  );
}
