import { Divider } from "@nextui-org/divider";
import TimelineItem from "./timeline-item";

type Props = {
  month: string;
  payments: RecurringPayment[];
};

export default function Timeline({ month, payments }: Props) {
  return (
    <div className="relative">
      <h2 className="text-lg font-bold py-4">{month}</h2>
      <div className="flex flex-col gap-2 pb-6">
        {payments.map((payment) => (
          <TimelineItem key={payment.id} payment={payment} />
        ))}
      </div>
      <Divider />
      <div className="absolute top-0 left-[111px] bottom-0 w-0.5 bg-primary"></div>
    </div>
  );
}
