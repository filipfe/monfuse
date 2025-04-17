"use client";

import { useEffect, useState, useTransition } from "react";
import Dropdown from "./dropdown";
import { Dict } from "@/const/dict";
import { Progress } from "@heroui/react";
import UniversalSelect from "../ui/universal-select";
import TelegramBot from "../automation/telegram-bot";
import { useTimezoneSelect } from "react-timezone-select";
import useSWR from "swr";
import { getLanguages } from "@/lib/settings/queries";
import { setupAccount } from "@/lib/auth/actions";
import toast from "@/utils/toast";
import { LOCALE_CURRENCIES } from "@/const/locales";
import { CURRENCIES } from "@/const";
import getLang from "@/utils/get-lang";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function AccountSetupForm({
  dict,
  settings,
  locale,
}: {
  dict: Dict["private"];
  settings: Settings;
  locale: Locale;
}) {
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState(settings.first_name || "");
  const [lastName, setLastName] = useState(settings.last_name || "");
  const [submitAvailable, setSubmitAvailable] = useState(false);
  const [timezone, setTimezone] = useState(deviceTimezone);
  const [language, setLanguage] = useState(getLang(locale));
  const { options, parseTimezone } = useTimezoneSelect({});
  const [currency, setCurrency] = useState(LOCALE_CURRENCIES[locale]);
  const [step, setStep] = useState(
    settings.first_name && settings.last_name ? 1 : 0
  );
  const { isLoading, data: languages } = useSWR("languages", () =>
    getLanguages()
  );
  const isDisabled =
    (step === 0 && (!firstName || !lastName)) ||
    (step === 1 && !currency) ||
    (step === 2 && (!language || !timezone));

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await setupAccount(formData);
      console.log(res.error);
      if (res?.error) {
        toast({
          type: "error",
          message: dict.general._error,
        });
      }
    });

  useEffect(() => {
    setSubmitAvailable(step > 2);
  }, [step]);

  return (
    <>
      <div className="flex items-end gap-4 justify-between px-6 sm:px-0">
        <div className="grid gap-1">
          <h1 className="font-bold text-xl sm:text-2xl">
            {dict["account-setup"].welcome}, {settings.first_name}
          </h1>
          <p className="text-font/80 text-sm">
            {dict["account-setup"].description}
          </p>
        </div>
        <div className="max-w-32 w-full mb-1">
          <Progress
            size="sm"
            value={step + 1}
            label={dict["account-setup"].progress.label}
            maxValue={4}
            classNames={{
              label: "text-xs text-font/60",
              value: "text-xs font-medium",
            }}
            showValueLabel
            valueLabel={`${step + 1} / 4`}
          />
        </div>
      </div>
      <form action={action}>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2 sm:gap-3">
            <Dropdown
              title={dict["account-setup"].form["personal-data"].title}
              step={step}
              onOpen={() => setStep(0)}
              index={0}
            >
              <Input
                name="first_name"
                label={
                  dict.settings.account["personal-data"].form["first-name"]
                    .label
                }
                placeholder={
                  dict.settings.account["personal-data"].form["first-name"]
                    .label
                }
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="max-w-xl"
              />
              <Input
                label={
                  dict.settings.account["personal-data"].form["last-name"].label
                }
                name="last_name"
                placeholder={
                  dict.settings.account["personal-data"].form["last-name"].label
                }
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="max-w-xl"
              />
            </Dropdown>
            <Dropdown
              title={dict["account-setup"].form.currency.title}
              step={step}
              disabled={!firstName || !lastName}
              onOpen={() => setStep(1)}
              index={1}
            >
              <UniversalSelect
                name="currency"
                aria-label="Currency select"
                value={currency}
                elements={CURRENCIES}
                required
                onValueChange={(value) => setCurrency(value)}
              />
            </Dropdown>
            <Dropdown
              title={dict["account-setup"].form.location.title}
              disabled={!currency}
              step={step}
              index={2}
              onOpen={() => setStep(2)}
            >
              <UniversalSelect
                name="language"
                aria-label="Language select"
                label={dict.settings.preferences.location.language.label}
                value={language}
                disabled={isLoading}
                elements={
                  languages
                    ? languages.map((lang) => ({
                        name: lang.name,
                        value: lang.code,
                      }))
                    : []
                }
                placeholder={
                  dict.settings.preferences.location.language.placeholder
                }
                onValueChange={(value) => setLanguage(value as Lang)}
              />
              <UniversalSelect
                label={dict.settings.preferences.location.timezone.label}
                value={timezone ? parseTimezone(timezone).value : undefined}
                elements={options as Option<string>[]}
                onValueChange={(val) =>
                  setTimezone(
                    parseTimezone(val).value ===
                      parseTimezone(deviceTimezone).value
                      ? deviceTimezone
                      : val
                  )
                }
              />
              <input type="hidden" name="timezone" value={timezone} />
            </Dropdown>
            <Dropdown
              title={dict["account-setup"].form.automation.title}
              step={step}
              disabled={!currency || !language || !timezone}
              index={3}
              onOpen={() => setStep(3)}
            >
              <TelegramBot
                simplified
                settings={settings}
                dict={dict.automation}
              />
            </Dropdown>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 sm:px-0">
            <Button
              variant="outline"
              className="bg-white"
              disabled={step === 0}
              onClick={() => setStep((prev) => prev - 1)}
            >
              {dict["account-setup"].form._back}
            </Button>
            <Button
              disabled={isDisabled || isPending}
              type={submitAvailable ? "submit" : "button"}
              onClick={() => step < 3 && setStep((prev) => prev + 1)}
            >
              {step < 3
                ? dict["account-setup"].form._submit.next
                : dict["account-setup"].form._submit.start}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
