create schema if not exists private;

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    phone text,
    role text not null default 'customer' check (role in ('customer', 'admin')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text not null default '',
    price_paise bigint not null check (price_paise >= 0),
    sku text not null unique,
    category text,
    fabric_type text,
    color text,
    pattern text,
    status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    object_path text not null unique,
    alt_text text not null default '',
    sort_order integer not null default 0 check (sort_order >= 0),
    is_primary boolean not null default false,
    created_at timestamptz not null default now()
);

create unique index product_images_one_primary
    on public.product_images(product_id)
    where is_primary;
create index product_images_product_sort
    on public.product_images(product_id, sort_order);

create table public.inventory (
    product_id uuid primary key references public.products(id) on delete restrict,
    stock_quantity integer not null default 0 check (stock_quantity >= 0),
    updated_at timestamptz not null default now()
);

create table public.wishlists (
    user_id uuid not null references auth.users(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, product_id)
);

create table public.carts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    status text not null default 'active' check (status in ('active', 'converted', 'abandoned')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index carts_one_active_per_user
    on public.carts(user_id)
    where status = 'active';

create table public.cart_items (
    id uuid primary key default gen_random_uuid(),
    cart_id uuid not null references public.carts(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete cascade,
    quantity integer not null check (quantity > 0 and quantity <= 50),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (cart_id, product_id)
);

create table public.addresses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    recipient_name text not null,
    phone text not null,
    line1 text not null,
    line2 text,
    city text not null,
    state text not null,
    postal_code text not null,
    country_code text not null default 'IN',
    is_default boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index addresses_user_id on public.addresses(user_id);

create table public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique,
    user_id uuid not null references auth.users(id) on delete restrict,
    status text not null default 'pending_payment' check (
        status in ('pending_payment', 'paid', 'payment_failed', 'cancelled', 'processing', 'shipped', 'delivered', 'refunded')
    ),
    subtotal_paise bigint not null check (subtotal_paise >= 0),
    shipping_paise bigint not null default 0 check (shipping_paise >= 0),
    total_paise bigint not null check (total_paise >= 0),
    currency text not null default 'INR' check (currency = 'INR'),
    shipping_address jsonb not null,
    razorpay_order_id text unique,
    stock_allocated boolean not null default false,
    stock_released boolean not null default false,
    expires_at timestamptz,
    paid_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index orders_user_created on public.orders(user_id, created_at desc);
create index orders_status_expires on public.orders(status, expires_at);

create table public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete restrict,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    sku text not null,
    category text,
    fabric_type text,
    color text,
    pattern text,
    unit_price_paise bigint not null check (unit_price_paise >= 0),
    quantity integer not null check (quantity > 0),
    line_total_paise bigint not null check (line_total_paise >= 0)
);

create index order_items_order_id on public.order_items(order_id);

create table public.payments (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete restrict,
    provider text not null default 'razorpay' check (provider = 'razorpay'),
    razorpay_order_id text not null,
    razorpay_payment_id text unique,
    webhook_event_id text unique,
    amount_paise bigint not null check (amount_paise >= 0),
    currency text not null default 'INR' check (currency = 'INR'),
    status text not null default 'created' check (status in ('created', 'authorized', 'captured', 'failed', 'refunded')),
    verified_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index payments_order_id on public.payments(order_id);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and role = 'admin'
    );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'));
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.wishlists enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
    for select to authenticated
    using (id = (select auth.uid()) or (select private.is_admin()));
create policy "profiles_update_own" on public.profiles
    for update to authenticated
    using (id = (select auth.uid()))
    with check (id = (select auth.uid()));

revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

create policy "products_public_read_active" on public.products
    for select to anon, authenticated
    using (status = 'active');
create policy "products_admin_read_all" on public.products
    for select to authenticated
    using ((select private.is_admin()));
create policy "products_admin_insert" on public.products
    for insert to authenticated with check ((select private.is_admin()));
create policy "products_admin_update" on public.products
    for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "products_admin_delete" on public.products
    for delete to authenticated using ((select private.is_admin()));

create policy "product_images_public_read" on public.product_images
    for select to anon, authenticated
    using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
create policy "product_images_admin_read_all" on public.product_images
    for select to authenticated
    using ((select private.is_admin()));
create policy "product_images_admin_all" on public.product_images
    for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "inventory_admin_all" on public.inventory
    for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "wishlists_owner_all" on public.wishlists
    for all to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));

create policy "carts_owner_all" on public.carts
    for all to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));

create policy "cart_items_owner_all" on public.cart_items
    for all to authenticated
    using (exists (
        select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())
    ))
    with check (exists (
        select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()) and c.status = 'active'
    ));

create policy "addresses_owner_all" on public.addresses
    for all to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));

create policy "orders_owner_or_admin_read" on public.orders
    for select to authenticated
    using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "orders_admin_update" on public.orders
    for update to authenticated
    using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "order_items_owner_or_admin_read" on public.order_items
    for select to authenticated
    using (exists (
        select 1 from public.orders o
        where o.id = order_id and (o.user_id = (select auth.uid()) or (select private.is_admin()))
    ));

create policy "payments_owner_or_admin_read" on public.payments
    for select to authenticated
    using (exists (
        select 1 from public.orders o
        where o.id = order_id and (o.user_id = (select auth.uid()) or (select private.is_admin()))
    ));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'product-images',
    'product-images',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "product_images_storage_admin_insert" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'product-images' and (select private.is_admin()));
create policy "product_images_storage_admin_update" on storage.objects
    for update to authenticated
    using (bucket_id = 'product-images' and (select private.is_admin()))
    with check (bucket_id = 'product-images' and (select private.is_admin()));
create policy "product_images_storage_admin_delete" on storage.objects
    for delete to authenticated
    using (bucket_id = 'product-images' and (select private.is_admin()));
