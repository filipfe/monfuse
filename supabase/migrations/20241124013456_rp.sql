set check_function_bodies = off;

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
      rp.interval_amount,
      rp.interval_unit,
      (rp.start_datetime + ((rp.interval_amount * rp.counter) || ' ' || rp.interval_unit)::interval)::date as next_payment
    from recurring_payments rp
    order by rp.created_at desc
    limit 6 offset (p_page - 1) * 6
  )
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', c1.id,
        'type', c1.type,
        'title', c1.title, 
        'amount', c1.amount,
        'currency', c1.currency,
        'interval_amount', c1.interval_amount,
        'interval_unit', c1.interval_unit,
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

CREATE OR REPLACE FUNCTION public.get_recurring_payments_upcoming_payments(p_timezone text)
 RETURNS TABLE(payment_datetime timestamp without time zone, id uuid, title text, type operation_type, amount double precision, currency currency_type)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query
  select 
    (rp.start_datetime + ((rp.interval_amount * rp.counter) || ' ' || rp.interval_unit)::interval) as payment_datetime,
    rp.id,
    rp.title,
    rp.type,
    rp.amount,
    rp.currency
  from recurring_payments rp
  where rp.start_datetime + ((rp.interval_amount * rp.counter) || ' ' || rp.interval_unit)::interval > current_timestamp at time zone p_timezone
  order by payment_datetime, rp.amount desc, rp.id
  limit 3;
end;
$function$
;


