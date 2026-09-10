create table public.reviews (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    order_id uuid not null references public.orders(id) on delete restrict,
    author_name text not null default 'Customer',
    rating smallint not null check (rating between 1 and 5),
    review_text text not null check (char_length(trim(review_text)) between 10 and 2000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, product_id)
);

create index reviews_product_created on public.reviews(product_id, created_at desc);
create index reviews_order_product on public.reviews(order_id, product_id);

create or replace function private.set_review_author_name()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    select coalesce(nullif(trim(full_name), ''), 'Customer')
    into new.author_name
    from public.profiles
    where id = new.user_id;
    return new;
end;
$$;

revoke all on function private.set_review_author_name() from public;

drop trigger if exists set_review_author_name on public.reviews;
create trigger set_review_author_name
    before insert or update on public.reviews
    for each row execute function private.set_review_author_name();

alter table public.reviews enable row level security;

create policy "reviews_public_read" on public.reviews
    for select to anon, authenticated
    using (true);

create policy "reviews_verified_customer_insert" on public.reviews
    for insert to authenticated
    with check (
        user_id = (select auth.uid())
        and exists (
            select 1
            from public.order_items oi
            join public.orders o on o.id = oi.order_id
            where oi.order_id = reviews.order_id
              and oi.product_id = reviews.product_id
              and o.user_id = (select auth.uid())
              and o.status in ('paid', 'processing', 'shipped', 'delivered')
        )
    );

create policy "reviews_owner_update" on public.reviews
    for update to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));

create policy "reviews_owner_delete" on public.reviews
    for delete to authenticated
    using (user_id = (select auth.uid()));

grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;
