"use client";

import LimitRef from "./limits/ref";
import { useState } from "react";
// import { useDisclosure } from "@heroui/react";
import LimitForm from "./limits/form";
import { Dict } from "@/const/dict";

export default function Limits({
  settings,
  dict,
}: {
  settings: Settings;
  dict: Dict["private"]["operations"]["expenses"]["limits"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  // const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [defaultLimit, setDefaultLimit] = useState({
    currency: settings.currency,
    period: "daily" as "daily" | "weekly" | "monthly",
    amount: "",
  });

  return (
    <>
      <div className="flex flex-col 2xl:grid grid-cols-3 gap-4 sm:gap-6 justify-center col-span-full">
        <LimitRef
          dict={dict}
          period="daily"
          settings={settings}
          onAdd={(currency, amount) => {
            setDefaultLimit({
              currency,
              period: "daily",
              amount: amount || "",
            });
            setIsOpen(true);
          }}
        />
        <LimitRef
          dict={dict}
          period="weekly"
          settings={settings}
          onAdd={(currency, amount) => {
            setDefaultLimit({
              currency,
              period: "weekly",
              amount: amount || "",
            });
            setIsOpen(true);
          }}
        />
        <LimitRef
          dict={dict}
          period="monthly"
          settings={settings}
          onAdd={(currency, amount) => {
            setDefaultLimit({
              currency,
              period: "monthly",
              amount: amount || "",
            });
            setIsOpen(true);
          }}
        />
      </div>
      <LimitForm
        open={isOpen}
        onOpenChange={setIsOpen}
        defaultLimit={defaultLimit}
        timezone={settings.timezone}
        dict={dict["modal"]}
      />
    </>
  );
}
