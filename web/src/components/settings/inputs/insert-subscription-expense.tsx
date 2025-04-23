"use client";

import LabelInput from "@/components/operations/inputs/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dict } from "@/const/dict";
import { useSettings } from "@/lib/general/queries";
import { updateSettings } from "@/lib/settings/queries";
import toast from "@/utils/toast";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  dict: Dict["private"]["settings"]["preferences"]["insert-subscription-expense"];
};

export default function InsertSubscriptionExpenseSwitch({ dict }: Props) {
  const [label, setLabel] = useState("");
  const { data: settings, mutate, isLoading } = useSettings();

  const onValueChange = async <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    try {
      await mutate(updateSettings(key, value), {
        optimisticData: (prev: any) => ({
          ...prev,
          [key]: value,
        }),
        revalidate: false,
        populateCache: true,
        rollbackOnError: true,
      });
    } catch (e) {
      toast({
        type: "error",
        message: dict._error,
      });
    }
  };

  useEffect(() => {
    if (!settings?.subscription_expense_label) return;
    setLabel(settings.subscription_expense_label);
  }, [settings?.subscription_expense_label]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 mb-2">
          <h3>{dict.title}</h3>
          <p className="text-sm text-font/60">{dict.description}</p>
        </div>
        {settings && (
          <Switch
            disabled={isLoading}
            checked={settings.insert_subscription_expense}
            onCheckedChange={(checked) =>
              onValueChange("insert_subscription_expense", checked)
            }
          />
        )}
      </div>
      <div className="flex flex-col">
        <LabelInput
          disabled={!settings?.insert_subscription_expense}
          dict={dict.label}
          value={label}
          onChange={(value) => setLabel(value)}
        />
        {settings &&
          label &&
          settings?.subscription_expense_label !== label && (
            <Button
              size="sm"
              className="mt-4 self-end"
              onClick={() => onValueChange("subscription_expense_label", label)}
            >
              <Check size={14} />
              {dict.label.save}
            </Button>
          )}
      </div>
    </div>
  );
}
