import Block from "@/components/ui/block";
import { ScrollShadow } from "@heroui/react";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import DividendsTable from "./dividends-table";
import { getDividendInfo } from "@/lib/stocks/actions";
import sortDividends from "@/utils/stocks/sort-dividends";
import groupDividends from "@/utils/stocks/group-dividends";
import { Button } from "@/components/ui/button";

export default async function Dividends() {
  const { results: dividends } = await getDividendInfo();
  const { future } = groupDividends(dividends);
  const orderedDividends = sortDividends(future).slice(0, 6);
  return (
    <Block
      title="Dywidendy"
      className="col-span-2 w-screen sm:w-auto"
      cta={cta}
    >
      <ScrollShadow hideScrollBar orientation="horizontal">
        <DividendsTable dividends={orderedDividends} simplified />
      </ScrollShadow>
    </Block>
  );
}

const cta = (
  <Button size="sm" variant="outline" asChild>
    <Link href="/stocks/dividends">
      <span className="mb-px">Więcej</span>
      <ChevronRightIcon size={14} />
    </Link>
  </Button>
);
