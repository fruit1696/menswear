create table public.product_option_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete restrict,
    product_name text not null,
    product_image text,
    product_details jsonb not null default '{}'::jsonb,
    requested_color text,
    requested_pattern text,
    customer_note text,
    status text not null default 'new' check (status in ('new', 'checking', 'replied', 'closed')),
    admin_reply text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (requested_color is not null or requested_pattern is not null),
    check (char_length(customer_note) <= 1000),
    check (char_length(admin_reply) <= 2000)
);

create index product_option_requests_user_created
    on public.product_option_requests(user_id, created_at desc);
create index product_option_requests_status_created
    on public.product_option_requests(status, created_at desc);

alter table public.product_option_requests enable row level security;

create policy "product_option_requests_owner_read" on public.product_option_requests
    for select to authenticated
    using (user_id = (select auth.uid()));
create policy "product_option_requests_owner_insert" on public.product_option_requests
    for insert to authenticated
    with check (user_id = (select auth.uid()) and status = 'new' and admin_reply is null);
create policy "product_option_requests_admin_read" on public.product_option_requests
    for select to authenticated
    using ((select private.is_admin()));
create policy "product_option_requests_admin_update" on public.product_option_requests
    for update to authenticated
    using ((select private.is_admin()))
    with check ((select private.is_admin()));

grant select, insert on public.product_option_requests to authenticated;
grant update (status, admin_reply, updated_at) on public.product_option_requests to authenticated;
