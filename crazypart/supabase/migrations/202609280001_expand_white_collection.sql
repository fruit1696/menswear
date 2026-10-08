insert into public.products (
    id, name, slug, description, price_paise, compare_at_price_paise, delivery_lead_days,
    sku, category, fabric_type, color, status
)
values
    ('20000000-0000-4000-8000-000000000009', 'Raymond White 09', 'white-09', 'White Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-WHITE-09', 'featured-collection', 'cotton', 'white', 'active'),
    ('20000000-0000-4000-8000-000000000010', 'Raymond White 21', 'white-21', 'White Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-WHITE-21', 'featured-collection', 'cotton', 'white', 'active'),
    ('20000000-0000-4000-8000-000000000011', 'Raymond White A2', 'white-a2', 'White Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-WHITE-A2', 'featured-collection', 'cotton', 'white', 'active'),
    ('20000000-0000-4000-8000-000000000012', 'Raymond White 1', 'white-1', 'White Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-WHITE-1', 'featured-collection', 'cotton', 'white', 'active')
on conflict (id) do update set
    name = excluded.name,
    slug = excluded.slug,
    description = excluded.description,
    price_paise = excluded.price_paise,
    compare_at_price_paise = excluded.compare_at_price_paise,
    delivery_lead_days = excluded.delivery_lead_days,
    sku = excluded.sku,
    category = excluded.category,
    fabric_type = excluded.fabric_type,
    color = excluded.color,
    status = excluded.status,
    updated_at = now();

insert into public.inventory (product_id, stock_quantity)
select id, 0
from public.products
where id in (
    '20000000-0000-4000-8000-000000000009',
    '20000000-0000-4000-8000-000000000010',
    '20000000-0000-4000-8000-000000000011',
    '20000000-0000-4000-8000-000000000012'
)
on conflict (product_id) do nothing;
