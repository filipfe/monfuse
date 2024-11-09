alter table "public"."settings" add column "insert_subscription_expense" boolean not null default true;

alter table "public"."settings" add column "subscription_expense_label" text;