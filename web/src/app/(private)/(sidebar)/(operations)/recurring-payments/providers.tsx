"use client";

import RecurringPaymentsTable from "@/components/recurring-payments/active/table";
import Calendar from "@/components/recurring-payments/calendar";
import { Dict } from "@/const/dict";
import { useState } from "react";

export default function Providers({
  settings,
  dict,
}: {
  settings: Settings;
  dict: Dict["private"]["operations"]["recurring-payments"];
}) {
  const [page, setPage] = useState(1);
  return (
    <>
      <RecurringPaymentsTable
        settings={settings}
        dict={dict.active}
        page={page}
        setPage={setPage}
      />
      <Calendar settings={settings} dict={dict.calendar} page={page} />
    </>
  );
}
