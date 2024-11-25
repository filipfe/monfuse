import { Breakpoint } from "./types.ts";
import { Locale } from "../_shared/types.ts";

export const limitBreakpoints: Breakpoint[] = [
  {
    value: 100,
    messages: {
      "pl": (period) => {
        switch (period) {
          case "daily":
            return "Osięgnięto limit dzienny {currency}! Kwota przekroczenia limitu: {amount}";
          case "weekly":
            return "Osięgnięto limit tygodniowy {currency}! Kwota przekroczenia limitu: {amount}";
          case "monthly":
            return "Osięgnięto limit miesięczny {currency}! Kwota przekroczenia limitu: {amount}";
        }
      },
      "en": (period) => {
        switch (period) {
          case "daily":
            return "Daily limit reached for {currency}! Over-limit amount: {amount}";
          case "weekly":
            return "Weekly limit reached for {currency}! Over-limit amount: {amount}";
          case "monthly":
            return "Monthly limit reached for {currency}! Over-limit amount: {amount}";
        }
      },
      "es": (period) => {
        switch (period) {
          case "daily":
            return "¡Se alcanzó el límite diario de {currency}! Importe sobrepasado: {amount}";
          case "weekly":
            return "¡Se alcanzó el límite semanal de {currency}! Importe sobrepasado: {amount}";
          case "monthly":
            return "¡Se alcanzó el límite mensual de {currency}! Importe sobrepasado: {amount}";
        }
      },
    },
  },
  {
    value: 75,
    messages: {
      "pl": (period) => {
        switch (period) {
          case "daily":
            return "Przekroczono 75% limitu dziennego w walucie {currency}! Pozostało jeszcze {amount}";
          case "weekly":
            return "Przekroczono 75% limitu tygodniowego w walucie {currency}! Pozostało jeszcze {amount}";
          case "monthly":
            return "Przekroczono 75% limitu miesięcznego w walucie {currency}! Pozostało jeszcze {amount}";
        }
      },
      "en": (period) => {
        switch (period) {
          case "daily":
            return "75% of the daily limit reached for {currency}! Remaining: {amount}";
          case "weekly":
            return "75% of the weekly limit reached for {currency}! Remaining: {amount}";
          case "monthly":
            return "75% of the monthly limit reached for {currency}! Remaining: {amount}";
        }
      },
      "es": (period) => {
        switch (period) {
          case "daily":
            return "¡Se alcanzó el 75% del límite diario de {currency}! Restante: {amount}";
          case "weekly":
            return "¡Se alcanzó el 75% del límite semanal de {currency}! Restante: {amount}";
          case "monthly":
            return "¡Se alcanzó el 75% del límite mensual de {currency}! Restante: {amount}";
        }
      },
    },
  },
  {
    value: 50,
    messages: {
      "pl": (period) => {
        switch (period) {
          case "daily":
            return "Przekroczono 50% limitu dziennego w walucie {currency}! Pozostało jeszcze {amount}";
          case "weekly":
            return "Przekroczono 50% limitu tygodniowego w walucie {currency}! Pozostało jeszcze {amount}";
          case "monthly":
            return "Przekroczono 50% limitu miesięcznego w walucie {currency}! Pozostało jeszcze {amount}";
        }
      },
      "en": (period) => {
        switch (period) {
          case "daily":
            return "50% of the daily limit reached for {currency}! Remaining: {amount}";
          case "weekly":
            return "50% of the weekly limit reached for {currency}! Remaining: {amount}";
          case "monthly":
            return "50% of the monthly limit reached for {currency}! Remaining: {amount}";
        }
      },
      "es": (period) => {
        switch (period) {
          case "daily":
            return "¡Se alcanzó el 50% del límite diario de {currency}! Restante: {amount}";
          case "weekly":
            return "¡Se alcanzó el 50% del límite semanal de {currency}! Restante: {amount}";
          case "monthly":
            return "¡Se alcanzó el 50% del límite mensual de {currency}! Restante: {amount}";
        }
      },
    },
  },
];

export const recurringDict: Record<
  Locale,
  (operation_type: "income" | "expense") => string
> = {
  pl: (operation_type) =>
    `Dodano ${
      operation_type === "income" ? "przychód" : "wydatek"
    } cykliczny {title} na kwotę {amount}`,
  en: (operation_type) =>
    `Added a recurring ${
      operation_type === "income" ? "income" : "expense"
    } titled {title} for the amount of {amount}`,

  es: (operation_type) =>
    `Se añadió un ${
      operation_type === "income" ? "ingreso" : "gasto"
    } recurrente titulado {title} por el monto de {amount}`,
};
