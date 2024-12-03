set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_timeline(p_timezone text, p_month integer, p_year integer)
 RETURNS TABLE(date date, incomes jsonb, expenses jsonb)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query
  with recursive cte1 as (
    select generate_series(
      make_date(p_year, p_month, 1),
      make_date(p_year, p_month, 1) + interval '1 month - 1 day',
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
      rp.start_datetime,
      rp.interval_unit,
      rp.interval_amount
    from recurring_payments rp
    where rp.start_datetime::date <= make_date(p_year, p_month, 1) + interval '1 month - 1 day'
  ),
  cte3 as (
    select
      c2.id,
      c2.title,
      c2.type,
      c2.amount,
      c2.currency,
      c2.start_datetime::date as payment_date,
      c2.interval_unit,
      c2.interval_amount
    from cte2 c2
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
    where (c3.payment_date + (c3.interval_amount || ' ' || c3.interval_unit)::interval)::date <= make_date(p_year, p_month, 1) + interval '1 month - 1 day'
  ),
  cte4 as (
    select
      o.id,
      o.title,
      o.type,
      o.amount,
      o.currency,
      o.issued_at::date as payment_date
    from operations o
    where 
      o.issued_at::date between make_date(p_year, p_month, 1) and make_date(p_year, p_month, 1) + interval '1 month - 1 day'
      and o.recurring = true
  ),
  cte5 as (
    select * from cte4
    union all
    select 
      c3.id, 
      c3.title, 
      c3.type, 
      c3.amount, 
      c3.currency, 
      c3.payment_date 
    from cte3 c3
    where c3.payment_date >= (current_date at time zone p_timezone)::date
  )
  select
    c1.date,
    coalesce(
      jsonb_agg(jsonb_build_object(
        'id', c5.id,
        'title', c5.title,
        'amount', c5.amount,
        'currency', c5.currency
      ) order by c5.amount desc, c5.title) filter (where c5.type = 'income'), '[]'::jsonb
    ) as incomes,
    coalesce(
      jsonb_agg(jsonb_build_object(
        'id', c5.id,
        'title', c5.title,
        'amount', c5.amount,
        'currency', c5.currency
      ) order by c5.amount desc, c5.title) filter (where c5.type = 'expense'), '[]'::jsonb
    ) as expenses
  from cte1 c1
  left join cte5 c5
    on c1.date = c5.payment_date
  group by c1.date
  order by c1.date;
end;
$function$
;