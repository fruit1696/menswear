create table public.explore_deposits (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete restrict,
    amount_paise bigint not null default 10000 check (amount_paise = 10000),
    currency text not null default 'INR' check (currency = 'INR'),
    status text not null default 'created' check (status in ('created', 'captured', 'failed', 'refunded')),
    razorpay_order_id text not null unique,
    razorpay_payment_id text unique,
    paid_at timestamptz,
    refunded_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index explore_deposits_user_status on public.explore_deposits(user_id, status);

alter table public.explore_deposits enable row level security;

create policy "explore_deposits_owner_read" on public.explore_deposits
    for select to authenticated
    using (user_id = (select auth.uid()));

grant select on public.explore_deposits to authenticated;

