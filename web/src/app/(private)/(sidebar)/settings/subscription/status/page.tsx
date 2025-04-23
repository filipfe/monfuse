import SubscriptionModal from "@/components/dashboard/subscription-modal";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const {
    private: {
      settings: {
        subscription: { _metadata, status: dict },
      },
    },
  } = await getDictionary(settings.language);
  return _metadata;
}

export default async function Page() {
  const settings = await getSettings();
  const {
    private: {
      settings: {
        subscription: { status: dict },
      },
    },
  } = await getDictionary(settings.language);
  return (
    <Suspense>
      <SubscriptionModal dict={dict} />
    </Suspense>
  );
}
