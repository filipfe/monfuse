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
        <div className="flex-1 relative min-h-48 2xl:min-h-0">
          <div className="absolute inset-0 w-full h-full">
            <ScrollShadow className="h-full" hideScrollBar>
              {payments.map((payment) => (
                <Ref payment={payment} settings={settings} key={payment.id} />
              ))}
            </ScrollShadow>
          </div>
        </div>
      ) : (
        <Empty icon={Coins} title={dict._empty.title} />
      )}
    </Block>
  );
}
