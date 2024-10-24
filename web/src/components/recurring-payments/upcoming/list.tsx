import Block from "@/components/ui/block";
import { getUpcomingPayments } from "@/lib/recurring-payments/actions";
import Timer from "./timer";
import Ref from "./ref";

export default async function Upcoming() {
  const { results } = await getUpcomingPayments();

  return (
    <Block title="Nadchodzące" className="col-span-2">
      {results.map(({ payment_date, payments }) => (
        <div key={payment_date}>
          <Timer paymentDate={payment_date + " " + "20:00:00"} />
          <ul>
            {payments.map((payment) => (
              <Ref key={payment.id} payment={payment} />
            ))}
          </ul>
        </div>
      ))}
      <div>
        <Timer paymentDate={"2024-10-22 20:00:00"} />
      </div>
      {/* // <Timer paymentDate={"2024-10-22 19:42:00"} /> */}
      {/* {payments.length > 0 ? (
        <HorizontalScroll>
          {payments
            .filter(
              ({ payment_date }) =>
                new Date(payment_date).getTime() > new Date().getTime()
            )
            .map((payment) => (
              <OperationRef
                languageCode={languageCode}
                payment={{ ...payment, issued_at: payment.payment_date }}
                key={payment.id}
              />
            ))}
        </HorizontalScroll>
      ) : (
        <Empty
          title="Brak nadchodzących płatności!"
          cta={{
            title: "Dodaj płatność cykliczną",
            href: "/recurring-payments/add",
          }}
        />
      )} */}
    </Block>
  );
}
