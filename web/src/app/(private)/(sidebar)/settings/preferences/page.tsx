import CurrencySelect from "@/components/settings/inputs/currency";
import LocationInput from "@/components/settings/inputs/location";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";

export default async function Preferences() {
  const settings = await getSettings();

  const {
    private: {
      settings: { preferences: dict },
    },
  } = await getDictionary(settings.language);

  return (
    <div className="flex flex-col lg:grid grid-cols-3">
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
          languageCode={settings.language}
        />
      </div>
    </div>
  );
}
