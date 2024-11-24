import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "supabase";
import { corsHeaders } from "../_shared/cors.ts";
import { Payment } from "../_shared/types.ts";
import { toZonedTime } from "npm:date-fns-tz";
import { endOfWeek, startOfWeek, subWeeks } from "npm:date-fns";
import { fromZonedTime } from "npm:date-fns-tz";
import { format } from "npm:date-fns-tz";

const HCTI_API_KEY = Deno.env.get("HCTI_API_KEY");
const HCTI_USER_ID = Deno.env.get("HCTI_USER_ID");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

if (!HCTI_API_KEY || !HCTI_USER_ID || !SUPABASE_ANON_KEY || !SUPABASE_URL) {
  throw new Error(
    `Environment variables missing: ${
      Object.entries({
        HCTI_API_KEY,
        HCTI_USER_ID,
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
      }).filter(([_key, value]) => !value).map(([key]) => key).join(", ")
    }`,
  );
}

const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Environment variables missing: SUPABASE_SERVICE_ROLE_KEY",
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type GraphProps = {
  settings: Profile["settings"];
  from: Date;
  expenses: Payment[];
  limit: number | null;
};

type DayProps = {
  date: Date;
  expenses: Payment[];
  weekSum: number;
  labels: Record<string, { amount: number; color: string }>;
  settings: Profile["settings"];
};

const colors = ["#177981", "#fdbb2d", "#40E0D0", "#ff7f50"];

const assignColors = (expenses: Payment[]) => {
  const groupedByLabel = expenses.reduce(
    (prev, { amount, label }) => ({
      ...prev,
      [label || ""]: (prev[label || ""] || 0) + amount,
    }),
    {} as Record<string, number>,
  );
  const colorMap: Record<string, { amount: number; color: string }> = {};
  Object.entries(groupedByLabel).sort(([_aL, aA], [_bL, bA]) => bA - aA)
    .forEach(([label, amount], k) => {
      colorMap[label] = {
        color: colors[k % colors.length],
        amount,
      };
    });
  return colorMap;
};

const currencyFormat = (
  { amount, settings, notation }: {
    amount: number;
    settings: Profile["settings"];
    notation?: Intl.NumberFormatOptions["notation"];
  },
) =>
  new Intl.NumberFormat(settings.language, {
    currency: settings.currency,
    style: "currency",
    notation,
  }).format(amount);

const renderDay = (
  { date, settings, labels, expenses, weekSum }: DayProps,
) => {
  const weekday = new Intl.DateTimeFormat(settings.language, {
    weekday: "short",
  }).format(date).toUpperCase();

  const groupedByLabel = expenses.reduce(
    (prev, { amount, label }) => ({
      ...prev,
      [label || ""]: (prev[label || ""] || 0) + amount,
    }),
    {} as Record<string, number>,
  );

  const daySum = Object.values(groupedByLabel).reduce(
    (prev, curr) => prev + curr,
    0,
  );

  return `
  <div class="flex flex-col gap-2 items-center">
    <div style="background-color: #FAFAFA;" class="h-72 rounded-t-md w-24 border flex flex-col overflow-hidden justify-end">
      <!-- This div height is relative to other days -->
      <div style="height: ${
    daySum / weekSum * 100
  }%;" class="relative flex flex-col-reverse">
        ${
    Object.entries(groupedByLabel).sort(([_aL, aA], [_bL, bA]) => bA - aA).map((
      [label, amount],
    ) => `
      <div
        style="background-color: ${labels[label].color}; height: ${
      amount / daySum * 100
    }%;"
        class="flex flex-col gap-2 text-white items-center justify-center w-full"
      ></div>
      `).join("")
  }
      </div> 
    </div>
    <div class="flex flex-col items-center">
      <h2 class="font-bold">${weekday}</h2>
      <h3 class="text-center">${
    currencyFormat({ settings, amount: daySum, notation: "compact" })
  }</h3>
    </div>
  </div>
  `;
};

const renderGraph = (
  { from, limit, settings, expenses }: GraphProps,
) => {
  const weekSum = expenses.reduce((prev, { amount }) => prev + amount, 0);
  const labels = assignColors(expenses);

  return `
  <!DOCTYPE html>
    <html lang="${settings.language}">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^2.0/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body>
        <div id="wrapper" class="mx-auto max-w-7xl rounded border px-10 py-12">
          <div class="flex w-full items-center justify-center gap-12">
            <div class="flex flex-col items-start">
              <div class="flex gap-4 w-full text-base leading-normal text-black">
                <div class="border-r mb-14 mr-3 flex flex-col justify-between items-end self-stretch">
                  <div class="relative flex h-px min-w-max items-center border-b pr-2">
                    <div class="bg-white px-0.5">
                      <p class="mr-2 min-w-max text-sm font-semibold leading-none">${
    currencyFormat({ settings, amount: weekSum })
  }</p>
                    </div>
                  </div>
                  <div class="relative flex h-px min-w-max items-center border-b pr-2">
                    <div class="bg-white px-0.5">
                      <p class="mr-2 min-w-max text-sm font-semibold leading-none">${
    currencyFormat({ settings, amount: Math.floor(weekSum / 2) })
  }</p>
                    </div>
                  </div>
                  <div class="relative flex h-px min-w-max items-center border-b pr-2">
                    <div class="bg-white px-0.5">
                      <p class="mr-2 min-w-max text-sm font-semibold leading-none">${
    currencyFormat({ settings, amount: 0 })
  }</p>
                    </div>
                  </div>
                </div>
                ${
    Array.from(Array(7)).map((_d, i) => {
      const date = new Date(from);
      date.setDate(date.getDate() + i);
      const zonedDate = toZonedTime(date, settings.timezone);
      return renderDay({
        date: zonedDate,
        weekSum,
        settings,
        expenses: expenses.filter((expense) =>
          format(
            toZonedTime(expense.issued_at, settings.timezone),
            "yyyy-MM-dd",
            {
              timeZone: settings.timezone,
            },
          ) === format(zonedDate, "yyyy-MM-dd", { timeZone: settings.timezone })
        ),
        labels,
      });
    }).join(
      "",
    )
  }
              </div>
            </div>
            <div class="flex flex-col gap-8">
              <div class='flex flex-col gap-0.5'>
                <p class="text-lg text-black">Wydano</p>
                <h3 class="text-5xl font-bold text-black">
                  ${currencyFormat({ settings, amount: weekSum })}
                </h3>
                ${
    limit
      ? `<h4 class="text-black opacity-60 text-2xl mt-2">/ ${
        currencyFormat({ settings, amount: limit })
      }</h4>`
      : ""
  }
              </div>
              <div>
                ${
    Object.entries(labels).map(([label, { color, amount }]) => `
                  <div class="flex items-center gap-2">
                    <div style="background-color: ${color};" class="h-3 w-5 rounded"></div>
                    <h4 class="mb-1 font-semibold">${label}</h4>
                    <span class="opacity-80 text-sm font-medium">(${
      currencyFormat({ settings, amount })
    })</span>
                  </div>
                `).join("")
  }
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { user } = await req.json() as { user: Profile };

  if (!user) {
    return new Response(
      JSON.stringify({ message: "Nie można pobrać informacji o koncie!" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // const { from, to } = getWeekPeriod(
  //   toZonedTime(new Date(), user.settings.timezone),
  // );

  const zonedTime = toZonedTime(new Date(), user.settings.timezone);

  const startOfCurrentWeek = startOfWeek(zonedTime, { weekStartsOn: 1 });
  const startOfPreviousWeek = subWeeks(startOfCurrentWeek, 1);

  const from = fromZonedTime(startOfPreviousWeek, user.settings.timezone);
  const to = fromZonedTime(
    endOfWeek(startOfPreviousWeek, { weekStartsOn: 1 }),
    user.settings.timezone,
  );

  const { data: expenses, error } = await supabase.from("expenses").select(
    "amount, label, issued_at",
  )
    .gte("issued_at", from.toUTCString())
    .lte("issued_at", to.toUTCString())
    .match({ user_id: user.id, currency: user.settings.currency })
    .returns<Payment[]>();

  if (error) {
    console.error("Couldn't get expenses: ", error);
    return new Response(
      JSON.stringify({
        message: "There was a problem gathering expenses",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }

  const { data: limit, error: limitError } = await supabase.from("limits")
    .select("amount").match({
      period: "weekly",
      user_id: user.id,
      currency: user.settings.currency,
    }).maybeSingle();

  if (limitError) {
    console.error("Couldn't get limit: ", limitError);
    return new Response(
      JSON.stringify({
        message: "There was a problem gathering limit",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }

  const html = renderGraph({
    from,
    expenses,
    settings: user.settings,
    limit: limit?.amount,
  });

  const response = await fetch("https://hcti.io/v1/image", {
    method: "POST",
    body: JSON.stringify({
      html,
      selector: "div[id='wrapper']",
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(HCTI_USER_ID + ":" + HCTI_API_KEY)}`,
    },
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        message: response.statusText ||
          "There was an error generating a graph",
      }),
      {
        ...response,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const data = await response.json();

  return new Response(
    data.url,
    { headers: corsHeaders },
  );
});
