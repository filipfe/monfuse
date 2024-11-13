import Active from "@/components/settings/subscription/active";
import Form from "@/components/settings/subscription/form";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { getOrCreateSubscription } from "@/lib/subscription/actions";
import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Subscription() {
  const { result: subscription, error } = await getOrCreateSubscription();
  const settings = await getSettings();

  const {
    private: {
      settings: { subscription: dict },
    },
  } = await getDictionary(settings.language);

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-danger">{dict._error}</p>
      </div>
    );
  }

  const isActive =
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  return (
    <div className="flex-1 w-full flex flex-col gap-6 2xl:grid grid-cols-[2fr_1fr]">
      {isActive ? (
        <Active dict={dict.active} {...subscription} />
      ) : (
        subscription && (
          <Form dict={dict.form} settings={settings} {...subscription} />
        )
      )}

      <div className="px-10 py-8 border bg-light rounded-md flex flex-col gap-6 self-start">
        <h3 className="font-medium">{dict.benefits.title}</h3>
        <ul className="grid gap-3">
          {dict.benefits.list.map((benefit) => (
            <li className="flex items-start gap-3 text-sm sm:text-base">
              <div className="bg-primary rounded-full h-4 w-4 min-w-4 mt-1 grid place-content-center">
                <Check color="white" size={12} strokeWidth={3} />
              </div>
              {benefit}
            </li>
          ))}
        </ul>
        <div className="flex-1 flex flex-col justify-end">
          <Link
            href="https://www.monfuse.com"
            className="justify-center flex items-center gap-2 bg-white rounded-md border text-sm h-10"
          >
            {dict.benefits.button}
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
