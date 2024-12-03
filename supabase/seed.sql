alter table profiles disable trigger after_profile_update;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  insert into settings (user_id, timezone, language, currency) 
  values (
    new.id,
    new.raw_user_meta_data ->> 'timezone',
    new.raw_user_meta_data ->> 'language',
    (new.raw_user_meta_data ->> 'currency')::currency_type
  );

  return new;
end;
$function$;

-- BUCKETS
insert into storage.buckets (
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types
) values (
  'docs', 
  'docs', 
  false, 
  10485760, 
  '{image/jpeg, image/png, application/pdf}'
);

-- LANGUAGES
insert into languages (name, code) values
  ('Polski', 'pl'),
  ('English', 'en'),
  ('Español', 'es');

-- SERVICES
insert into services (
  name, 
  href, 
  price, 
  title, 
  description
) values (
  'stocks', 
  '/stocks', 
  14.99, 
  'Akcje', 
  'Usługa zarządzania akcjami umożliwia efektywne zarządzanie finansami, oferując narzędzia do monitorowania inwestycji, analizowania rynku i podejmowania świadomych decyzji inwestycyjnych. Dzięki niej użytkownicy mogą śledzić wartość swoich portfeli, otrzymywać powiadomienia o istotnych zmianach rynkowych oraz korzystać z raportów i analiz dostosowanych do ich indywidualnych potrzeb.'
);

-- USER
insert into auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new, 
  email_change,
  raw_app_meta_data, 
  raw_user_meta_data,
  created_at, 
  updated_at,
  phone_change, 
  phone_change_token,
  email_change_token_current, 
  email_change_confirm_status,
  reauthentication_token
) values (
  '00000000-0000-0000-0000-000000000000', 
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  'authenticated', 
  'authenticated', 
  'test@monfuse.com',  
  extensions.crypt('maciek102', extensions.gen_salt('bf')), 
  timezone('utc'::text, now()),
  '', 
  '',
  '', 
  '',
  '{"provider": "email", "providers": ["email"]}', 
  '{
    "first_name": "Rory", 
    "last_name": "Zappa", 
    "currency": "PLN", 
    "language": "pl",
    "timezone": "Europe/Warsaw"
  }',
  timezone('utc'::text, now()), 
  timezone('utc'::text, now()),
  '', 
  '',
  '', 
  0, 
  ''
);

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  '{
    "sub": "8d65ee5d-3897-4f61-b467-9bdc8df6f07f", 
    "first_name": "Rory", 
    "last_name": "Zappa", 
    "currency": "PLN", 
    "timezone": "Europe/Warsaw"
  }', 
  'email', 
  timezone('utc'::text, now()), 
  timezone('utc'::text, now()), 
  timezone('utc'::text, now())
);

-- EXPENSES
with cte1 as (
  select
    case
      when random() < 0.3 then 'Food'
      when random() < 0.6 then 'Bills'
      when random() < 0.75 then 'Transport'
      when random() < 0.85 then 'Entertainment'
      when random() < 0.9 then 'Clothing'
      else (array[
        'Gifts', 'Vacation', 'Health', 'Apartment', 'Sport', 'Culture', 'Electronics'
      ])[floor(random() * 7 + 1)]
    end as label
  from generate_series(1, 1000)
)
insert into expenses (title, amount, currency, user_id, label, recurring, from_telegram, issued_at)
select
  case
    when c1.label = 'Food' then (array['Groceries', 'Restaurant lunch', 'Cafe lunch', 'Takeout food'])[floor(random() * 4 + 1)]
    when c1.label = 'Bills' then (array['Electricity bill', 'Water bill', 'Gas bill', 'Phone bill', 'Internet bill'])[floor(random() * 5 + 1)]
    when c1.label = 'Transport' then (array['Train ticket', 'Bus ticket', 'Fuel', 'Car service', 'Taxi ride'])[floor(random() * 5 + 1)]
    when c1.label = 'Entertainment' then (array['Cinema ticket', 'Concert ticket', 'Streaming subscription', 'Amusement park trip'])[floor(random() * 4 + 1)]
    when c1.label = 'Clothing' then (array['Clothing purchase', 'Shoe purchase', 'Winter jacket purchase', 'T-shirt and pants purchase'])[floor(random() * 4 + 1)]
    when c1.label = 'Gifts' then (array['Birthday gift', 'Christmas gift', 'Gift for a friend'])[floor(random() * 3 + 1)]
    when c1.label = 'Vacation' then (array['Mountain vacation', 'Beach vacation', 'Weekend getaway'])[floor(random() * 3 + 1)]
    when c1.label = 'Health' then (array['Doctor visit', 'Medicine purchase', 'Health insurance'])[floor(random() * 3 + 1)]
    when c1.label = 'Apartment' then 'Apartment rent'
    when c1.label = 'Sport' then (array['Gym membership', 'Sports equipment purchase', 'Fitness classes'])[floor(random() * 3 + 1)]
    when c1.label = 'Culture' then (array['Theater ticket', 'Museum visit', 'Cultural event'])[floor(random() * 3 + 1)]
    when c1.label = 'Electronics' then (array['Laptop purchase', 'Smartphone purchase', 'Headphone purchase'])[floor(random() * 3 + 1)]
    else 'Other'
  end,
  case
    when c1.label = 'Food' then round((random() * 200 + 20)::numeric, 2)
    when c1.label = 'Bills' then round((random() * 400 + 100)::numeric, 2)
    when c1.label = 'Transport' then round((random() * 150 + 10)::numeric, 2)
    when c1.label = 'Entertainment' then round((random() * 300 + 30)::numeric, 2)
    when c1.label = 'Clothing' then round((random() * 500 + 50)::numeric, 2)
    when c1.label = 'Gifts' then round((random() * 300 + 50)::numeric, 2)
    when c1.label = 'Vacation' then round((random() * 3000 + 500)::numeric, 2)
    when c1.label = 'Health' then round((random() * 500 + 50)::numeric, 2)
    when c1.label = 'Apartment' then round((random() * 2000 + 800)::numeric, 2)
    when c1.label = 'Sport' then round((random() * 400 + 50)::numeric, 2)
    when c1.label = 'Culture' then round((random() * 200 + 30)::numeric, 2)
    when c1.label = 'Electronics' then round((random() * 5000 + 500)::numeric, 2)
    else round((random() * 1000 + 100)::numeric, 2)
  end,
  ( 
    case
      when random() < 0.8 then 'PLN'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end
  )::currency_type,
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  c1.label,
  case
    when random() < 0.05 then true
    else false
  end as recurring,
  random() < 0.3 as from_telegram,
  now() - (random() * interval '1 year')
from cte1 c1;

-- INCOMES
with cte1 as(
  select
    case
      when random() < 0.5 then 'Salary'
      when random() < 0.7 then (array['Freelance Project', 'Consultations', 'Additional Work'])[floor(random() * 3 + 1)]
      when random() < 0.8 then (array['Employer Bonus', 'Annual Bonus', 'Performance Bonus'])[floor(random() * 3 + 1)]
      when random() < 0.85 then (array['Investment Return', 'Dividend', 'Cryptocurrency Trading Profit'])[floor(random() * 3 + 1)]
      when random() < 0.9 then (array['Gift from Family', 'Inheritance'])[floor(random() * 2 + 1)]
      when random() < 0.95 then 'Rental Income'
      else 'Tax Refund'
    end as title
  from generate_series(1, 70)
)
insert into incomes (title, amount, currency, user_id, recurring, from_telegram, issued_at)
select
  c1.title,
  case
    when c1.title = 'Salary' then round((random() * 2000 + 6000)::numeric, 2)
    when c1.title = 'Freelance Project' then round((random() * 2000 + 2500)::numeric, 2)
    when c1.title = 'Consultations' then round((random() * 2000 + 3000)::numeric, 2)
    when c1.title = 'Additional Work' then round((random() * 1500 + 2000)::numeric, 2)
    when c1.title = 'Employer Bonus' then round((random() * 2000 + 3000)::numeric, 2)
    when c1.title = 'Annual Bonus' then round((random() * 2000 + 4000)::numeric, 2)
    when c1.title = 'Performance Bonus' then round((random() * 2000 + 3500)::numeric, 2)
    when c1.title = 'Investment Return' then round((random() * 7000 + 5000)::numeric, 2)
    when c1.title = 'Dividend' then round((random() * 5000 + 5000)::numeric, 2)
    when c1.title = 'Cryptocurrency Trading Profit' then round((random() * 7000 + 8000)::numeric, 2)
    when c1.title = 'Gift from Family' then round((random() * 2000 + 1000)::numeric, 2)
    when c1.title = 'Inheritance' then round((random() * 13000 + 7000)::numeric, 2)
    when c1.title = 'Rental Income' then round((random() * 2000 + 4000)::numeric, 2)
    else round((random() * 1000 + 1000)::numeric, 2)
  end,
  ( 
    case
      when random() < 1 then 'USD'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end
  )::currency_type,
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  case
    when title = 'Salary' or title = 'Rental Income' then true
    else false
  end,
  random() < 0.2 as from_telegram,
  now() - (random() * interval '1 year')
from cte1 c1;

-- RECURRING PAYMENTS
insert into recurring_payments (title, amount, currency, type, user_id, interval_amount, interval_unit, start_datetime)
values (
  ('Apartment rent', 1200.00, 'USD', 'expense', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 1, 'month', (current_date || ' 10:00:00')::timestamp),
  ('Electricity bill', 120.50, 'USD', 'expense', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 1, 'month', (current_date || ' 08:00:00')::timestamp),
  ('Internet bill', 50.00, 'USD', 'expense', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 1, 'month', (current_date || ' 09:00:00')::timestamp),
  ('Phone subscription', 60.00, 'EUR', 'expense', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 1, 'month', (current_date || ' 11:00:00')::timestamp),
  
  ('Salary', 3500.00, 'USD', 'income', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 1, 'month', (current_date || ' 10:00:00')::timestamp),
  ('Bonus', 500.00, 'USD', 'income', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 1, 'year', (current_date || ' 14:00:00')::timestamp),
  ('Rental income', 2000.00, 'GBP', 'income', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 1, 'month', (current_date || ' 12:00:00')::timestamp),
  ('Investment return', 1500.00, 'USD', 'income', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 1, 'year', (current_date || ' 10:00:00')::timestamp);
)
-- with cte1 as (
--   select 
--     (array['income', 'expense'])[floor(random() * 2 + 1)]::operation_type as type
--   from generate_series(1, 10)
-- ), cte2 as (
--   select
--     c1.type,
--     case
--       when c1.type = 'expense' then 
--         case
--           when random() < 0.6 then 'month'
--           when random() < 0.8 then 'year'
--           when random() < 0.9 then 'week'
--           else 'day'
--         end
--       else 
--         case
--           when random() < 0.7 then 'month'
--           when random() < 0.9 then 'week'
--           else 'year'
--         end
--     end::interval_unit_type as interval_unit
--   from cte1 c1
-- )
-- insert into recurring_payments (title, amount, currency, type, user_id, interval_amount, interval_unit, start_datetime)
-- select
--   case
--     when c2.type = 'expense' then 
--       (array['Apartment rent', 'Electricity bill', 'Internet bill', 'Phone subscription', 'Streaming subscription', 'Insurance policy'])[floor(random() * 6 + 1)]
--     else 
--       (array['Salary', 'Bonus', 'Rental income', 'Investment return'])[floor(random() * 4 + 1)]
--   end,
--   case
--     when c2.type = 'expense' then round((random() * 500 + 50)::numeric, 2)
--     else round((random() * 10000 + 2000)::numeric, 2)
--   end,
--   case
--     when random() < 1 then 'USD'
--     else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
--   end::currency_type,
--   c2.type,
--   '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
--   case
--     when c2.interval_unit = 'day' then floor(random() * 5 + 1)
--     when c2.interval_unit = 'week' then floor(random() * 3 + 1)
--     when c2.interval_unit = 'month' then 1
--     when c2.interval_unit = 'year' then 1
--   end,
--   c2.interval_unit,
--   now() - (random() * interval '3 day')
-- from cte2 c2;

-- GOALS
with cte1 as (
  select 
    case
      when random() < 0.2 then 'Vacation'
      when random() < 0.4 then 'Car Purchase'
      when random() < 0.6 then 'Apartment Renovation'
      when random() < 0.75 then 'Electronic Equipment'
      when random() < 0.85 then 'New Phone'
      else 'Investment'
    end as title
  from generate_series(1, 7)
), cte2 as (
  insert into goals (title, price, currency, user_id, deadline, is_priority)
  select
    c1.title,
    case
      when c1.title = 'Vacation' then round((random() * 8000 + 2000)::numeric, 2)
      when c1.title = 'Car Purchase' then round((random() * 50000 + 20000)::numeric, 2)
      when c1.title = 'Apartment Renovation' then round((random() * 30000 + 10000)::numeric, 2)
      when c1.title = 'Electronic Equipment' then round((random() * 5000 + 1000)::numeric, 2)
      when c1.title = 'New Phone' then round((random() * 3000 + 1000)::numeric, 2)
      else round((random() * 100000 + 50000)::numeric, 2)
    end,
    case
      when random() < 0.8 then 'PLN'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end::currency_type,
    '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
    case
      when random() < 0.15 then null
      else (now() + (random() * interval '3 year'))::date
    end,
    true
  from cte1 c1 
  returning id, price
) 
insert into goals_payments (goal_id, amount, date)
select 
  c2.id, 
  round((random() * (c2.price / 10))::numeric, 2), 
  gs.date
from cte2 c2
cross join (
  select 
    now()::date - s.i as date
  from generate_series(0, 29) s(i)
  order by random()
  limit 10
) as gs;

-- LIMITS
insert into limits (user_id, period, currency, amount)
select
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  period,
  'PLN'::currency_type,
  case
    when period = 'daily' then 300
    when period = 'weekly' then 1500
    when period = 'monthly' then 6000
  end
from (
  select 'daily'::period_type as period
  union all
  select 'weekly'
  union all
  select 'monthly'
) as periods;