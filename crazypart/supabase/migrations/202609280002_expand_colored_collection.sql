insert into public.products (
    id, name, slug, description, price_paise, compare_at_price_paise, delivery_lead_days,
    sku, category, fabric_type, color, status
)
values
    ('20000000-0000-4000-8000-000000000013', 'Raymond Colored 10 Variant', 'colored-10-gemini', 'Colored Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-10V', 'featured-collection', 'cotton', 'colored', 'active'),
    ('20000000-0000-4000-8000-000000000014', 'Raymond Colored 11', 'colored-11', 'Colored Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-11', 'featured-collection', 'cotton', 'colored', 'active'),
    ('20000000-0000-4000-8000-000000000015', 'Raymond Colored 12', 'colored-12', 'Colored Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-12', 'featured-collection', 'cotton', 'colored', 'active'),
    ('20000000-0000-4000-8000-000000000016', 'Raymond Colored 15', 'colored-15', 'Colored Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-15', 'featured-collection', 'cotton', 'colored', 'active'),
    ('20000000-0000-4000-8000-000000000017', 'Raymond Colored 16', 'colored-16', 'Colored Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-16', 'featured-collection', 'cotton', 'colored', 'active'),
    ('20000000-0000-4000-8000-000000000018', 'Raymond Colored 17', 'colored-17', 'Colored Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-17', 'featured-collection', 'cotton', 'colored', 'active'),
    ('20000000-0000-4000-8000-000000000019', 'Raymond Colored 18', 'colored-18', 'Colored Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-18', 'featured-collection', 'cotton', 'colored', 'active'),
    ('20000000-0000-4000-8000-000000000020', 'Raymond Black 2', 'colored-black-2', 'Black Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-BLACK2', 'featured-collection', 'cotton', 'black', 'active'),
    ('20000000-0000-4000-8000-000000000021', 'Raymond Blue 1', 'colored-blue-1', 'Blue Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-COLOR-BLUE1', 'featured-collection', 'cotton', 'blue', 'active')
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
    '20000000-0000-4000-8000-000000000013',
    '20000000-0000-4000-8000-000000000014',
    '20000000-0000-4000-8000-000000000015',
    '20000000-0000-4000-8000-000000000016',
    '20000000-0000-4000-8000-000000000017',
    '20000000-0000-4000-8000-000000000018',
    '20000000-0000-4000-8000-000000000019',
    '20000000-0000-4000-8000-000000000020',
    '20000000-0000-4000-8000-000000000021'
)
on conflict (product_id) do nothing;
