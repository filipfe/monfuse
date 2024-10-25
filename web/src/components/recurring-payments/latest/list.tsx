import Block from "@/components/ui/block";
import {
  getLatestPayments,
  getUpcomingPayments,
} from "@/lib/recurring-payments/actions";
import Ref from "./ref";
import Empty from "@/components/ui/empty";

export default async function Latest() {
  const { results: payments } = await getLatestPayments();

  return (
    <Block title="Ostatnie" className="row-span-2">
      {payments.length > 0 ? (
        <div className="flex flex-col gap-2">
          {payments.map((payment) => (
            <Ref key={payment.id} payment={payment} />
          ))}
        </div>
      ) : (
        <Empty title="Brak ostatnich płatności!" />
      )}
    </Block>
  );
}
