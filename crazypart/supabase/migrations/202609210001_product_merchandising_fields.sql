alter table public.products
    add column compare_at_price_paise bigint check (compare_at_price_paise is null or compare_at_price_paise >= price_paise),
    add column delivery_lead_days integer check (delivery_lead_days is null or delivery_lead_days between 0 and 90);

update public.products
set compare_at_price_paise = 150000,
    delivery_lead_days = 4
where slug in ('azure-linen', 'ivory-herringbone', 'slate-evening', 'vibrant-collection');
