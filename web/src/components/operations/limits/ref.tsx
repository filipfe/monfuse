"use client";

import Block from "@/components/ui/block";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { Dict } from "@/const/dict";
import { useLimits } from "@/lib/general/queries";
import NumberFormat from "@/utils/formatters/currency";
import { Button, CircularProgress, cn, Skeleton } from "@nextui-org/react";
import { Plus, SquarePen } from "lucide-react";
import { useState } from "react";

interface Props extends Pick<Limit, "period"> {
  dict: Dict["private"]["operations"]["expenses"]["limits"];
  settings: Settings;
  onAdd: (currency: string, amount?: string) => void;
}

export default function LimitRef({ dict, period, settings, onAdd }: Props) {
  const [currency, setCurrency] = useState(settings.currency);
  const { data: limits, isLoading } = useLimits(settings.timezone, currency);

  const limit = limits?.find((limit: Limit) => limit.period === period);

  const percentage = limit ? (limit.total / limit.amount) * 100 : 0;

  return (
    <Block
      className={cn(
        "sm:px-6 relative",
        !isLoading && !limit && "min-h-32 2xl:min-h-[114px] sm:py-6"
      )}
    >
      <div
        className={cn(
          "flex justify-between gap-3",
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
        <div className="hidden sm:flex items-center justify-between gap-3">
          {limit && (
            <Button
              variant="flat"
              size="sm"
              radius="md"
              disableRipple
              isIconOnly
              className="border"
              onPress={() => onAdd(currency, limit.amount.toString())}
            >
              <SquarePen size={14} />
            </Button>
          )}
          <UniversalSelect
            className="w-20"
            name="currency"
            size="sm"
            radius="md"
            aria-label="Waluta"
            selectedKeys={[currency]}
            elements={CURRENCIES}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>
      </div>
      {!isLoading && !limit && (
        <div className="grid place-content-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2">
          <Button
            variant="flat"
            radius="md"
            size="sm"
            disableRipple
            startContent={<Plus size={14} />}
            className="bg-light border max-w-max text-font"
            onPress={() => onAdd(currency)}
          >
            {dict._empty.label}
          </Button>
        </div>
      )}
    </Block>
  );
}
