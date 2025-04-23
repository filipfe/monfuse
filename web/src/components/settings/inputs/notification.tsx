"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dict } from "@/const/dict";
import { useSettings } from "@/lib/general/queries";
import { updateSettings } from "@/lib/settings/queries";
import toast from "@/utils/toast";
import Link from "next/link";

type Props = {
  dict: Dict["private"]["settings"]["notifications"];
  field: keyof Settings["notifications"];
};

export default function NotificationSwitch({ dict, field }: Props) {
  const { data: settings, mutate, isLoading, error } = useSettings();
  const onValueChange = async (isSelected: boolean) => {
    try {
      await mutate(updateSettings(field + "_notifications", isSelected), {
        optimisticData: (prev: any) => ({ ...prev, [field]: isSelected }),
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

  const isDisabled =
    field === "telegram" && !isLoading && !error && !settings?.telegram_id;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1 mb-2">
        <h3>{dict[field].title}</h3>
        <p className="text-sm text-font/60">{dict[field].description}</p>
      </div>
      {isDisabled ? (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div>
                <Switch disabled />
              </div>
            </TooltipTrigger>
            <TooltipContent className="flex flex-col items-center gap-2 py-2 px-2">
              <p className="text-sm">{dict.telegram.tooltip.title}</p>
              <Button size="sm" asChild>
                <Link href="/automation">{dict.telegram.tooltip.button}</Link>
              </Button>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        settings && (
          <Switch
            disabled={isLoading}
            checked={
              settings.notifications[
                field as keyof Settings["notifications"]
              ] as boolean
            }
            onCheckedChange={onValueChange}
          />
        )
      )}
    </div>
  );
}
