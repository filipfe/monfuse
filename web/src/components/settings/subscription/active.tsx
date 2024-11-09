import { Dict } from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Check } from "lucide-react";
import Deactivate from "./deactivate";

export default async function Active({
  dict,
  status,
  plan,
  id,
  cancel_at_period_end,
}: Subscription & {
  dict: Dict["private"]["settings"]["subscription"]["active"];
}) {
  const settings = await getSettings();

  return (
    <div className="px-10 py-8 border bg-light rounded-md flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 bg-primary rounded-full grid place-content-center">
          <Check size={32} color="white" />
        </div>
        <h3 className="sm:text-lg lg:text-xl">
          {dict.title[status === "active" ? 0 : 1]}
        </h3>
        <p className="text-sm">{dict.description}</p>
      </div>
      <p className="inline-flex items-end">
        <strong className="text-2xl sm:text-3xl lg:text-4xl">
          {new Intl.NumberFormat(settings.language, {
            style: "currency",
            currency: plan.currency,
          }).format(plan.amount / 100)}
        </strong>
        <sub className="text-sm mb-1 ml-2 opacity-80">/ {dict.month}</sub>
      </p>
      <Deactivate
        dict={dict.deactivate}
        subscription={{ id, cancel_at_period_end }}
      />
    </div>
  );
}
