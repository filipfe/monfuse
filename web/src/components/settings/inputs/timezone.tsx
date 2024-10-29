"use client";

import { useTimezoneSelect } from "react-timezone-select";
import UniversalSelect from "@/components/ui/universal-select";
import { useEffect, useRef, useState, useTransition } from "react";
import { Dict } from "@/const/dict";
import { updatePreferences } from "@/lib/settings/actions";
import toast from "@/utils/toast";

export default function TimezoneSelect({
  dict,
  defaultValue,
}: {
  dict: Dict["private"]["settings"]["preferences"]["location"]["timezone"] & {
    _success: string;
  };
  defaultValue: string;
}) {
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezone, setTimezone] = useState(defaultValue || deviceTimezone);
  const { options, parseTimezone } = useTimezoneSelect({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!formRef.current || timezone === (defaultValue || deviceTimezone))
      return;
    formRef.current.requestSubmit();
  }, [timezone]);

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await updatePreferences(formData);
      if (res?.error) {
        toast({
          type: "error",
          message: res.error,
        });
      } else {
        toast({
          type: "success",
          message: dict._success,
        });
      }
    });

  return (
    <form action={action} ref={formRef}>
      <UniversalSelect
        label={dict.label}
        selectedKeys={timezone ? [parseTimezone(timezone).value] : []}
        isLoading={isPending}
        isDisabled={isPending}
        elements={options as Option<string>[]}
        onChange={(e) =>
          setTimezone(
            parseTimezone(e.target.value).value ===
              parseTimezone(deviceTimezone).value
              ? deviceTimezone
              : e.target.value
          )
        }
      />
      <input type="hidden" name="timezone" value={timezone} />
      <input type="hidden" name="name" value="timezone" />
      <input type="hidden" name="value" value={timezone} />
    </form>
  );
}
