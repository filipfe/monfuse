"use client";

import LabelInput from "@/components/operations/inputs/label";
import { Dict } from "@/const/dict";
import { useSettings } from "@/lib/general/queries";
import { useLabels } from "@/lib/operations/queries";
import { updatePreferences } from "@/lib/settings/actions";
import { updateSettings } from "@/lib/settings/queries";
import toast from "@/utils/toast";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type Props = {
  dict: Dict["private"]["settings"]["preferences"]["insert-subscription-expense"];
};

export default function InsertSubscriptionExpenseSwitch({ dict }: Props) {
  const [label, setLabel] = useState("");
  const { data: labels, isLoading: areLabelsLoading } = useLabels();
  const { data: settings, mutate, isLoading, error } = useSettings();
  const [isPending, startTransition] = useTransition();

  const onValueChange = async (isSelected: boolean) => {
    try {
      await mutate(updateSettings("insert_subscription_expense", isSelected), {
        optimisticData: (prev: any) => ({
          ...prev,
          insert_subscription_expense: isSelected,
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

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await updatePreferences(formData);
      if (res?.error) {
        toast({
          type: "error",
          message: dict._error,
        });
      } else {
        mutate();
      }
    });

  useEffect(() => {
    if (!settings?.subscription_expense_label) return;
    setLabel(settings.subscription_expense_label);
  }, [settings?.subscription_expense_label]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2 mb-2">
          <h3>{dict.title}</h3>
          <p className="text-sm text-font/60">{dict.description}</p>
        </div>
        {settings && (
          <Switch
            isDisabled={isLoading}
            isSelected={settings.insert_subscription_expense}
            onValueChange={onValueChange}
          />
        )}
      </div>
      <form action={action}>
        <div className="flex flex-col">
          <Autocomplete
            name="value"
            label={dict.label.label}
            placeholder={dict.label.placeholder}
            isClearable={false}
            multiple
            allowsCustomValue
            isLoading={isLoading}
            isDisabled={!settings?.insert_subscription_expense}
            inputProps={{
              classNames: {
                inputWrapper: "bg-light border shadow-none",
              },
            }}
            value={label}
            onSelectionChange={(key) => key && setLabel(key as string)}
            onValueChange={(value) => setLabel(value)}
            maxLength={48}
            showScrollIndicators
          >
            {labels
              ? labels.map((label) => (
                  <AutocompleteItem
                    value={label.name}
                    textValue={label.name}
                    description={`${label.count} ${dict.label.description}`}
                    classNames={{
                      base: "!bg-white hover:!bg-light",
                    }}
                    key={label.name}
                  >
                    {label.name}
                  </AutocompleteItem>
                ))
              : []}
          </Autocomplete>
          <input type="hidden" name="name" value="subscription_expense_label" />
          {settings &&
            label &&
            settings?.subscription_expense_label != label && (
              <Button
                type="submit"
                color="primary"
                size="sm"
                radius="md"
                startContent={
                  isPending ? (
                    <l-hatch size={10} stroke={1} color="#FFF" />
                  ) : (
                    <Check size={14} />
                  )
                }
                className="mt-6 self-end"
                disableRipple
                isDisabled={isPending}
              >
                {dict.label.save}
              </Button>
            )}
        </div>
      </form>
    </div>
  );
}
