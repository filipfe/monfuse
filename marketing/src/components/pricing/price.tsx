"use client";

import { LOCALE_CURRENCIES } from "@/lib/currencies";
import { useParams } from "next/navigation";

export default function Price() {
  const { lang } = useParams();
  return new Intl.NumberFormat(lang, {
    currency: LOCALE_CURRENCIES[lang as Locale],
    style: "currency",
  }).format(29);
}
