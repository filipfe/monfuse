import Block from "@/components/ui/block";
import { getLatestPayments } from "@/lib/recurring-payments/actions";
import Ref from "./ref";
import Empty from "@/components/ui/empty";
import { ScrollShadow } from "@heroui/react";
import { Dict } from "@/const/dict";
import { Coins } from "lucide-react";

export default async function Latest({
  settings,
  dict,
}: {
  settings: Settings;
  dict: Dict["private"]["operations"]["recurring-payments"]["latest"];
}) {
  const { results: payments } = await getLatestPayments();

  return (
    <Block title={dict.title} className="gap-0">
      {payments.length > 0 ? (
        <ScrollShadow className="2xl:max-h-[calc(100vh-702px)]" hideScrollBar>
          {payments.map((payment) => (
            <Ref payment={payment} settings={settings} key={payment.id} />
          ))}
        </ScrollShadow>
      ) : (
        <Empty icon={Coins} title={dict._empty.title} />
      )}
    </Block>
  );
}
