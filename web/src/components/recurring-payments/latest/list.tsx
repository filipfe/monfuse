import Block from "@/components/ui/block";
import {
  getLatestPayments,
  getUpcomingPayments,
} from "@/lib/recurring-payments/actions";
import Ref from "./ref";
import Empty from "@/components/ui/empty";
import { ScrollShadow } from "@nextui-org/react";

export default async function Latest({ settings }: { settings: Settings }) {
  const { results: payments } = await getLatestPayments();

  return (
    <Block title="Ostatnie" className="gap-0">
      {payments.length > 0 ? (
        <ScrollShadow className="2xl:max-h-[calc(100vh-692px)]" hideScrollBar>
          {payments.map((payment) => (
            <Ref payment={payment} settings={settings} key={payment.id} />
          ))}
        </ScrollShadow>
      ) : (
        <Empty title="Brak ostatnich płatności!" />
      )}
    </Block>
  );
}
