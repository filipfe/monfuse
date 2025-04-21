import { Dict } from "@/const/dict";
import LanguageSelect from "./language";
import TimezoneSelect from "./timezone";

export default function LocationInput({
  settings,
  dict,
}: {
  settings: Settings;
  dict: Dict["private"]["settings"]["preferences"]["location"] & {
    _success: string;
  };
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 mb-2">
        <h3>{dict.title}</h3>
        <p className="text-sm text-font/60">{dict.description}</p>
      </div>
      <LanguageSelect
        dict={{ ...dict.language, _success: dict._success }}
        defaultValue={settings.language}
      />
      <TimezoneSelect
        dict={{ ...dict.timezone, _success: dict._success }}
        defaultValue={settings.timezone}
      />
    </div>
  );
}
