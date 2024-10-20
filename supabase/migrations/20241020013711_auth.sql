alter table "public"."limits" drop constraint "public_limits_user_id_fkey";

alter table "public"."settings" alter column "timezone" drop not null;

alter table "public"."limits" add constraint "limits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."limits" validate constraint "limits_user_id_fkey";


