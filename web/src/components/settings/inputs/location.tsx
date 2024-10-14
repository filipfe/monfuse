import LanguageSelect from "./language";
import TimezoneSelect from "./timezone";

export default function LocationInput({
  language,
}: Pick<Preferences, "language">) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-2">
        <h3>Lokalizacja</h3>
        <p className="text-sm text-font/60">Wybierz język i strefę czasową</p>
      </div>
      <LanguageSelect defaultValue={language.code} />
      <TimezoneSelect />
    </div>
  );
}
