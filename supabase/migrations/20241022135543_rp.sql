drop function if exists "public"."get_recurring_payments_active_payments"(p_page integer);

alter table "public"."recurring_payments" alter column "counter" set default '0'::smallint;

alter table "public"."settings" alter column "language" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_timeline()
 RETURNS TABLE(date date, incomes jsonb, expenses jsonb)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query
  with recursive cte1 as (
    select generate_series(
      current_date - interval '7 day',
      current_date + interval '7 day',
      interval '1 day'
    )::date as date
  ), 
  cte2 as (
    select
      rp.id,
      rp.title,
      rp.type,
      rp.amount,
      rp.currency,
      rp.start_date,
      rp.interval_unit,
      rp.interval_amount
    from recurring_payments rp
  ),
  cte3 as (
    select
      c2.id,
      c2.title,
      c2.type,
      c2.amount,
      c2.currency,
      c2.start_date as payment_date,
      c2.interval_unit,
      c2.interval_amount
    from cte2 c2
    where c2.start_date <= current_date + interval '7 day'
    union all
    select
      c3.id,
      c3.title,
      c3.type,
      c3.amount,
      c3.currency,
      (c3.payment_date + (c3.interval_amount || ' ' || c3.interval_unit)::interval)::date as payment_date,
      c3.interval_unit,
      c3.interval_amount
    from cte3 c3
    where (c3.payment_date + (c3.interval_amount || ' ' || c3.interval_unit)::interval)::date <= current_date + interval '7 day'
  )
  select
    c1.date,
    coalesce(
      jsonb_agg(jsonb_build_object(
        'id', c3.id,
        'title', c3.title,
        'amount', c3.amount,
        'currency', c3.currency
      ) order by c3.amount desc, c3.title) filter (where c3.type = 'income'), '[]'::jsonb
    ) as incomes,
    coalesce(
      jsonb_agg(jsonb_build_object(
        'id', c3.id,
        'title', c3.title,
        'amount', c3.amount,
        'currency', c3.currency
      ) order by c3.amount desc, c3.title) filter (where c3.type = 'expense'), '[]'::jsonb
    ) as expenses
  from cte1 c1
  left join cte3 c3
    on c1.date = c3.payment_date
  group by c1.date
  order by c1.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_active_payments(p_page integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  result jsonb;
begin
  with cte1 as (
    select 
      rp.id,
      rp.title,
      rp.type,
      rp.amount,
      rp.currency,
      (rp.start_date + ((rp.interval_amount * rp.counter) || ' ' || rp.interval_unit)::interval)::date as last_payment,
      (rp.start_date + ((rp.interval_amount * (rp.counter + 1)) || ' ' || rp.interval_unit)::interval)::date as next_payment
    from recurring_payments rp
    limit 8 offset (p_page - 1) * 8
  )
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', c1.id,
        'type', c1.type,
        'title', c1.title, 
        'amount', c1.amount,
        'currency', c1.currency,
        'last_payment', c1.last_payment,
        'next_payment', c1.next_payment
      )),
      'count', (select count(*) from recurring_payments)
    )
  into result
  from cte1 c1;
  
  return result;
end;
$function$
;


