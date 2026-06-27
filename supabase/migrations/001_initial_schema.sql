-- Bloom Coffee schema

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table public.drinks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  base_price numeric(10, 2) not null check (base_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.add_ons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence public.order_display_id_seq start 1000;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  display_id integer not null default nextval('order_display_id_seq'),
  customer_name text not null,
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  drink_id uuid references public.drinks (id) on delete set null,
  drink_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null,
  line_total numeric(10, 2) not null
);

create table public.order_item_addons (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items (id) on delete cascade,
  add_on_id uuid references public.add_ons (id) on delete set null,
  add_on_name text not null,
  price numeric(10, 2) not null
);

alter table public.profiles enable row level security;
alter table public.drinks enable row level security;
alter table public.add_ons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_addons enable row level security;

create policy "Profiles read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Drinks public read"
  on public.drinks for select
  using (true);

create policy "Drinks admin insert"
  on public.drinks for insert
  with check (public.is_admin());

create policy "Drinks admin update"
  on public.drinks for update
  using (public.is_admin());

create policy "Drinks admin delete"
  on public.drinks for delete
  using (public.is_admin());

create policy "Add-ons public read"
  on public.add_ons for select
  using (true);

create policy "Add-ons admin insert"
  on public.add_ons for insert
  with check (public.is_admin());

create policy "Add-ons admin update"
  on public.add_ons for update
  using (public.is_admin());

create policy "Add-ons admin delete"
  on public.add_ons for delete
  using (public.is_admin());

create policy "Orders public insert"
  on public.orders for insert
  with check (true);

create policy "Orders public read"
  on public.orders for select
  using (true);

create policy "Order items public insert"
  on public.order_items for insert
  with check (true);

create policy "Order items public read"
  on public.order_items for select
  using (true);

create policy "Order item addons public insert"
  on public.order_item_addons for insert
  with check (true);

create policy "Order item addons public read"
  on public.order_item_addons for select
  using (true);
