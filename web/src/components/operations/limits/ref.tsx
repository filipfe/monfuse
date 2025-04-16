"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Block from "@/components/ui/block";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/const";
import { Dict } from "@/const/dict";
import { useLimits } from "@/lib/general/queries";
import { deleteLimit } from "@/lib/operations/queries";
import { cn } from "@/utils/cn";
import NumberFormat from "@/utils/formatters/currency";
import { CircularProgress, Skeleton } from "@heroui/react";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props extends Pick<Limit, "period"> {
  dict: Dict["private"]["operations"]["expenses"]["limits"];
  settings: Settings;
  onAdd: (currency: string, amount?: string) => void;
}

export default function LimitRef({ dict, period, settings, onAdd }: Props) {
  const [currency, setCurrency] = useState(settings.currency);
  const {
    data: limits,
    mutate,
    isLoading,
  } = useLimits(settings.timezone, currency);

  const limit = limits?.find((limit: Limit) => limit.period === period);

  const percentage = limit ? (limit.total / limit.amount) * 100 : 0;

  async function onDelete() {
    if (!limit) return;
    try {
      await deleteLimit(limit.period);
      mutate();
    } catch (err) {}
  }

  return (
    <Block
      className={cn(
        "sm:px-6 !py-6 relative h-[130px]",
        !isLoading && limit && "justify-center"
      )}
    >
      <div
        className={cn(
          "flex justify-between gap-3 flex-1",
          !isLoading && !limit ? "items-start" : "items-center"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-[58px] h-[58px] border-[6px] border-default-300/50 rounded-full"></div>
            <div className="grid gap-1">
              <Skeleton className="w-14 h-5 rounded-full" />
              <Skeleton className="w-36 h-5 rounded-full" />
            </div>
          </div>
        ) : limit ? (
          <div className="flex items-center gap-3">
            <CircularProgress
              size="lg"
              value={percentage}
              showValueLabel
              classNames={{
                svg: "w-16 h-16",
                value: "font-bold text-[80%]",
              }}
            />
            <div className="grid">
              <span className="text-sm text-font/60">
                {dict.period[period]}
              </span>
              <span className="text-sm font-medium">
                <NumberFormat currency={currency} amount={limit.total} /> /{" "}
                <NumberFormat currency={currency} amount={limit.amount} />
              </span>
            </div>
          </div>
        ) : (
          <h4 className="text-sm">{dict._empty.title[period]}</h4>
        )}
        <div className="grid grid-cols-2 sm:flex items-center justify-between gap-2">
          {limit && (
            <Button
              // variant="flat"
              variant="outline"
              size="icon"
              // radius="md"
              // disableRipple
              // isIconOnly
              // className="border"
              className="h-8 w-8"
              onClick={() => onAdd(currency, limit.amount.toString())}
            >
              <SquarePen size={14} />
            </Button>
          )}
          {limit && (
            //  <ConfirmationModal
            //   onSuccess={mutate}
            //   disclosure={deleteDisclosure}
            //   mutation={deleteLimit}
            //   dict={dict.delete.modal}
            // >
            //   <input type="hidden" name="period" value={limit.period} />
            // </ConfirmationModal>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Trash2 size={14} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{dict.delete.modal.title}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {dict.delete.modal.description}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">
                      {dict.delete.modal.cancel}
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button onClick={onDelete}>
                      {dict.delete.modal.proceed}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Select
            value={currency}
            onValueChange={(value) => setCurrency(value)}
          >
            <SelectTrigger size="sm" className="w-20 col-span-2 row-start-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-20 min-w-0" align="end">
              {CURRENCIES.map((curr) => (
                <SelectItem value={curr} key={curr}>
                  {curr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {!isLoading && !limit && (
        <div className="grid place-content-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2">
          <Button variant="outline" size="sm" onClick={() => onAdd(currency)}>
            <Plus size={14} />
            {dict._empty.label}
          </Button>
        </div>
      )}
    </Block>
  );
}
