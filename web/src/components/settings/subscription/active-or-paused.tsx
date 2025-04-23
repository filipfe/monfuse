import { Dict } from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Check, Pause } from "lucide-react";
import Deactivate from "./deactivate";
import Resume from "./resume";

interface Props extends Subscription {
  dict: Dict["private"]["settings"]["subscription"];
}

export default async function ActiveOrPaused({
  dict,
  status,
  plan,
  id,
  is_trial,
  trial_end,
  cancel_at_period_end,
}: Props) {
  const settings = await getSettings();

  const isTrial = status === "trialing" || is_trial;
  const isActive = isTrial || status === "active";
  const isPaused = status === "paused";

  return (
    <div className="px-10 py-8 border bg-light rounded-md flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 bg-primary rounded-full grid place-content-center">
          {isPaused ? (
            <Pause size={32} color="white" />
          ) : (
            <Check size={32} color="white" />
          )}
        </div>
        <h3 className="sm:text-lg lg:text-xl">
          {isPaused
            ? dict.paused.title
            : dict.active.title[status === "active" ? 0 : 1]}
        </h3>
        <p className="text-sm">
          {dict[isPaused ? "paused" : "active"].description}
        </p>
      </div>
      {!isTrial ? (
        <p className="inline-flex items-end">
          <strong className="text-2xl sm:text-3xl lg:text-4xl">
            {new Intl.NumberFormat(settings.language, {
              style: "currency",
              currency: plan.currency,
            }).format(plan.amount / 100)}
          </strong>
          <sub className="text-sm mb-1 ml-2 opacity-80">
            / {dict.active.month}
          </sub>
        </p>
      ) : (
        isActive &&
        typeof trial_end === "number" && (
          <p className="text-sm opacity-80 text-center">
            {dict.active.trial_end}{" "}
            {new Intl.DateTimeFormat(settings.language, {
              dateStyle: "long",
              timeStyle: "short",
            }).format(new Date(trial_end * 1000))}
          </p>
        )
      )}
      {!isTrial && !isPaused && (
        <Deactivate
          dict={dict.active.deactivate}
          subscription={{ id, cancel_at_period_end }}
        />
      )}
      {isPaused && <Resume subscription_id={id} dict={dict.paused.resume} />}
    </div>
  );
}
