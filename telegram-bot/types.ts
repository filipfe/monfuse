import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "grammy:i18n";
import { type ConversationFlavor } from "https://deno.land/x/grammy_conversations@v2.0.1/mod.ts";

export type SessionData = {
  lastPayments: string[];
  user: Profile | null;
  __language_code?: string;
};

export type BotContext = ConversationFlavor<
  & Context
  & SessionFlavor<SessionData>
  & I18nFlavor
>;

export type Profile = {
  id: string;
  first_name: string;
  telegram_id: number;
  settings: {
    language: string;
    currency: string;
    telegram_notifications: boolean;
    email_notifications: boolean;
    timezone: string;
  };
};

export type Command = Record<string, string>;

export type ProcessReturn = {
  reply: string;
  ids: string[];
  operations: Payment[];
};

export interface Payment {
  id: string;
  issued_at: string;
  title: string;
  currency: string;
  amount: number;
  type: "income" | "expense";
  user_id: string;
  recurring: boolean;
  label?: string;
}

export type Preferences = {
  currency: string;
  language: string;
};

export type Period = "daily" | "weekly" | "monthly";

export type Limit = {
  amount: number;
  currency: string;
  total: number;
  period: Period;
};

export type Locale = "pl" | "en" | "es";

export type Goal = {
  id: string;
  title: string;
  price: number;
  total_paid: number;
  currency: string;
  deadline?: string;
  is_priority?: boolean;
  payments?: GoalPayment[];
};

type GoalPayment = {
  amount: number;
  date: string;
};
