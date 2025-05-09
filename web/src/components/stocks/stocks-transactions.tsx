import { Fragment, Suspense } from "react";
// import TransactionTable from "./transactions-table";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import Loader from "./loader";
import OwnStocks from "./own-stocks";
import { getHoldings, getOwnStocks } from "@/lib/stocks/actions";
import { Button } from "../ui/button";

export default async function StocksAndTransactions() {
  const [{ result: holdings }, { results: transactions, count }] =
    await Promise.all([getHoldings(6), getOwnStocks(undefined, 6)]);

  return (
    <Fragment>
      <Suspense fallback={<Loader className="col-span-2" />}>
        <OwnStocks holdings={holdings || {}} />
      </Suspense>
      <div className="col-span-2 flex items-stretch">
        {/* <TransactionTable
          type="stock"
          title="Ostatnie transakcje"
          count={count || 0}
          rows={transactions || []}
          simplified
          topContent={cta}
        /> */}
      </div>
    </Fragment>
  );
}

const cta = (
  <Button size="sm" variant="outline" asChild>
    <Link href="/stocks/transactions">
      <span className="mb-px">Więcej</span>
      <ChevronRightIcon size={14} />
    </Link>
  </Button>
);
