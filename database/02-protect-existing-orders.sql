-- Run AFTER the new deployment is working, not while the old app still uses its public key.
-- Keeps all existing orders but restricts access to the website server.
begin;
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant select, update on public.orders to service_role;
commit;
