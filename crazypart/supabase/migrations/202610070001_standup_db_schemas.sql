-- Migration: Stand up schema tables per DBSchema*.md specifications

-- 1. PRODUCT TYPES
create table if not exists public.product_types (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Seed initial product types if missing
insert into public.product_types (name, description)
values
    ('fabric', 'Fabric cutpieces and materials'),
    ('boxer', 'Boxer garments')
on conflict (name) do nothing;

-- 2. PRODUCTS ENHANCEMENTS & FABRIC / BOXER SPECIFIC TABLES
alter table public.products
    add column if not exists product_type_id uuid references public.product_types(id),
    add column if not exists price numeric check (price >= 0),
    add column if not exists featured boolean not null default false;

-- Backfill product_type_id for existing products to 'fabric'
update public.products
set product_type_id = (select id from public.product_types where name = 'fabric' limit 1)
where product_type_id is null;

-- Populate price from price_paise if price is null
update public.products
set price = (price_paise::numeric / 100.0)
where price is null and price_paise is not null;

-- Fabrics specific table (1:1 with products)
create table if not exists public.fabrics (
    product_id uuid primary key references public.products(id) on delete cascade,
    fabric_type text not null default 'Cotton',
    color text not null default 'White',
    color_family text not null default 'White',
    pattern text not null default 'Solid / Plain',
    weight text not null default 'Midweight',
    width_inches numeric not null default 58 check (width_inches > 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Boxers specific table (1:1 with products)
create table if not exists public.boxers (
    product_id uuid primary key references public.products(id) on delete cascade,
    size text,
    color text,
    material text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Backfill fabrics rows for existing products
insert into public.fabrics (product_id, fabric_type, color, color_family, pattern)
select 
    id, 
    coalesce(fabric_type, 'Cotton'), 
    coalesce(color, 'White'), 
    coalesce(color, 'White'), 
    coalesce(pattern, 'Solid / Plain')
from public.products
on conflict (product_id) do nothing;

-- 3. PRODUCT IMAGES & INVENTORY RESERVATIONS
alter table public.product_images
    add column if not exists image_url text,
    add column if not exists display_order integer not null default 0 check (display_order >= 0);

update public.product_images
set image_url = object_path
where image_url is null;

create unique index if not exists product_images_one_primary_per_product
    on public.product_images(product_id)
    where is_primary = true;


create table if not exists public.inventory_reservations (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    quantity integer not null check (quantity > 0),
    user_id uuid references auth.users(id) on delete set null,
    expires_at timestamptz not null,
    status text not null default 'active' check (status in ('active', 'confirmed', 'expired', 'cancelled')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists inventory_reservations_product_status
    on public.inventory_reservations(product_id, status);

-- 4. PROFILES & ADDRESSES
alter table public.profiles
    add column if not exists display_name text;

update public.profiles
set display_name = full_name
where display_name is null and full_name is not null;

alter table public.addresses
    add column if not exists full_name text,
    add column if not exists address_line1 text,
    add column if not exists address_line2 text,
    add column if not exists country text default 'IN';

update public.addresses
set 
    full_name = coalesce(full_name, recipient_name),
    address_line1 = coalesce(address_line1, line1),
    address_line2 = coalesce(address_line2, line2),
    country = coalesce(country, country_code, 'IN')
where full_name is null or address_line1 is null;

-- 5. CARTS & CART ITEMS
-- Enforce unique cart per user for active carts
alter table public.carts
    drop constraint if exists carts_user_id_key;

alter table public.carts
    add constraint carts_user_id_key unique (user_id);

-- 6. ORDERS, PAYMENTS, RETURNS & REFUNDS
alter table public.orders
    add column if not exists subtotal numeric check (subtotal >= 0),
    add column if not exists shipping_fee numeric not null default 0 check (shipping_fee >= 0),
    add column if not exists discount numeric not null default 0 check (discount >= 0),
    add column if not exists total_amount numeric check (total_amount >= 0),
    add column if not exists shipping_full_name text,
    add column if not exists shipping_phone text,
    add column if not exists shipping_address_line1 text,
    add column if not exists shipping_address_line2 text,
    add column if not exists shipping_city text,
    add column if not exists shipping_state text,
    add column if not exists shipping_postal_code text,
    add column if not exists shipping_country text default 'IN';

update public.orders
set 
    subtotal = coalesce(subtotal, (subtotal_paise::numeric / 100.0)),
    shipping_fee = coalesce(shipping_fee, (shipping_paise::numeric / 100.0)),
    total_amount = coalesce(total_amount, (total_paise::numeric / 100.0)),
    shipping_full_name = coalesce(shipping_full_name, shipping_address->>'recipient_name', shipping_address->>'full_name', 'Customer'),
    shipping_phone = coalesce(shipping_phone, shipping_address->>'phone', ''),
    shipping_address_line1 = coalesce(shipping_address_line1, shipping_address->>'line1', shipping_address->>'address_line1', ''),
    shipping_address_line2 = coalesce(shipping_address_line2, shipping_address->>'line2', shipping_address->>'address_line2'),
    shipping_city = coalesce(shipping_city, shipping_address->>'city', ''),
    shipping_state = coalesce(shipping_state, shipping_address->>'state', ''),
    shipping_postal_code = coalesce(shipping_postal_code, shipping_address->>'postal_code', ''),
    shipping_country = coalesce(shipping_country, shipping_address->>'country', 'IN')
where subtotal is null or shipping_full_name is null;

alter table public.order_items
    add column if not exists unit_price numeric check (unit_price >= 0),
    add column if not exists line_total numeric check (line_total >= 0),
    add column if not exists image_url text;

update public.order_items
set 
    unit_price = coalesce(unit_price, (unit_price_paise::numeric / 100.0)),
    line_total = coalesce(line_total, (line_total_paise::numeric / 100.0))
where unit_price is null;

alter table public.payments
    add column if not exists idempotency_key text,
    add column if not exists provider_order_id text,
    add column if not exists provider_payment_id text,
    add column if not exists payment_method text,
    add column if not exists amount numeric check (amount >= 0),
    add column if not exists failure_reason text,
    add column if not exists provider_signature text,
    add column if not exists paid_at timestamptz,
    add column if not exists metadata jsonb default '{}'::jsonb;

update public.payments
set 
    idempotency_key = coalesce(idempotency_key, id::text),
    provider_order_id = coalesce(provider_order_id, razorpay_order_id),
    provider_payment_id = coalesce(provider_payment_id, razorpay_payment_id),
    amount = coalesce(amount, (amount_paise::numeric / 100.0)),
    paid_at = coalesce(paid_at, verified_at)
where amount is null;

-- Returns Table
create table if not exists public.returns (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    status text not null default 'requested' check (status in ('requested', 'approved', 'rejected', 'received', 'completed')),
    reason text not null,
    notes text,
    requested_at timestamptz not null default now(),
    received_at timestamptz,
    completed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Return Items Table
create table if not exists public.return_items (
    id uuid primary key default gen_random_uuid(),
    return_id uuid not null references public.returns(id) on delete cascade,
    order_item_id uuid not null references public.order_items(id) on delete cascade,
    quantity integer not null check (quantity > 0),
    condition text,
    inspection_notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Refunds Table
create table if not exists public.refunds (
    id uuid primary key default gen_random_uuid(),
    payment_id uuid not null references public.payments(id) on delete cascade,
    order_id uuid not null references public.orders(id) on delete cascade,
    return_id uuid references public.returns(id) on delete set null,
    amount numeric not null check (amount > 0),
    status text not null default 'initiated' check (status in ('initiated', 'processed', 'failed')),
    provider_refund_id text unique,
    reason text,
    created_at timestamptz not null default now(),
    processed_at timestamptz,
    updated_at timestamptz not null default now()
);

-- 7. REVIEWS ENHANCEMENTS
alter table public.reviews
    add column if not exists title text check (char_length(title) <= 120),
    add column if not exists body text check (char_length(body) >= 10 and char_length(body) <= 2000),
    add column if not exists display_name text check (char_length(display_name) >= 1 and char_length(display_name) <= 80);

update public.reviews
set 
    body = coalesce(body, review_text),
    display_name = coalesce(display_name, author_name, 'Customer')
where body is null or display_name is null;

-- 8. ROW LEVEL SECURITY POLICIES FOR NEW TABLES
alter table public.product_types enable row level security;
alter table public.fabrics enable row level security;
alter table public.boxers enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.returns enable row level security;
alter table public.return_items enable row level security;
alter table public.refunds enable row level security;

-- Public read for product types, fabrics, boxers
create policy "product_types_public_read" on public.product_types
    for select to anon, authenticated using (true);

create policy "fabrics_public_read" on public.fabrics
    for select to anon, authenticated using (true);

create policy "boxers_public_read" on public.boxers
    for select to anon, authenticated using (true);

-- Admin manage policy for catalog tables
create policy "product_types_admin_all" on public.product_types
    for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "fabrics_admin_all" on public.fabrics
    for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "boxers_admin_all" on public.boxers
    for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Inventory reservations RLS
create policy "inventory_reservations_owner_read" on public.inventory_reservations
    for select to authenticated using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy "inventory_reservations_admin_all" on public.inventory_reservations
    for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Returns & Return Items RLS
create policy "returns_owner_read" on public.returns
    for select to authenticated using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy "returns_owner_insert" on public.returns
    for insert to authenticated with check (user_id = (select auth.uid()));

create policy "return_items_owner_read" on public.return_items
    for select to authenticated using (exists (
        select 1 from public.returns r where r.id = return_id and (r.user_id = (select auth.uid()) or (select private.is_admin()))
    ));

-- Refunds RLS
create policy "refunds_owner_or_admin_read" on public.refunds
    for select to authenticated using (exists (
        select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or (select private.is_admin()))
    ));

grant select on public.product_types to anon, authenticated;
grant select on public.fabrics to anon, authenticated;
grant select on public.boxers to anon, authenticated;
grant select, insert on public.returns to authenticated;
grant select on public.return_items to authenticated;
grant select on public.refunds to authenticated;
