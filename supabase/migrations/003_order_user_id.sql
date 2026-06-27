-- Link orders to authenticated customers for order history

alter table public.orders
  add column user_id uuid references auth.users on delete set null;

create index orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

drop policy if exists "Orders public insert" on public.orders;

create policy "Orders insert"
  on public.orders for insert
  with check (user_id is null or user_id = auth.uid());

create policy "Orders read own"
  on public.orders for select
  using (auth.uid() = user_id);
