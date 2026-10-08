insert into public.products (
    id, name, slug, description, price_paise, compare_at_price_paise, delivery_lead_days,
    sku, category, fabric_type, color, status
)
values
    ('20000000-0000-4000-8000-000000000001', 'Raymond Classic White', 'white-classic', 'Classic white Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-WHITE-CLASSIC', 'featured-collection', 'cotton', 'white', 'active'),
    ('20000000-0000-4000-8000-000000000002', 'Raymond Textured White', 'white-textured', 'Textured white Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-WHITE-TEXTURED', 'featured-collection', 'cotton', 'white', 'active'),
    ('20000000-0000-4000-8000-000000000003', 'Raymond Premium Ivory', 'white-premium', 'Premium ivory Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-WHITE-IVORY', 'featured-collection', 'cotton', 'ivory', 'active'),
    ('20000000-0000-4000-8000-000000000004', 'Raymond White Linen', 'white-linen', 'White linen Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-WHITE-LINEN', 'featured-collection', 'linen', 'white', 'active'),
    ('20000000-0000-4000-8000-000000000005', 'Raymond Sky Blue', 'blue-sky', 'Sky blue Raymond shirt fabric, sold as a 2-piece cut.', 46000, 150000, 4, 'CC-BLUE-SKY', 'featured-collection', 'cotton', 'sky blue', 'active'),
    ('20000000-0000-4000-8000-000000000006', 'Raymond Classic Navy', 'blue-navy', 'Classic navy Raymond shirt fabric, sold as a 2-piece cut.', 50000, 150000, 4, 'CC-BLUE-NAVY', 'featured-collection', 'cotton', 'navy', 'active'),
    ('20000000-0000-4000-8000-000000000007', 'Raymond Azure Cotton', 'blue-azure', 'Azure cotton Raymond shirt fabric, sold as a 2-piece cut.', 52000, 150000, 4, 'CC-BLUE-AZURE', 'featured-collection', 'cotton', 'azure', 'active'),
    ('20000000-0000-4000-8000-000000000008', 'Raymond Royal Blue', 'blue-royal', 'Royal blue Raymond shirt fabric, sold as a 2-piece cut.', 56000, 150000, 4, 'CC-BLUE-ROYAL', 'featured-collection', 'cotton', 'royal blue', 'active')
on conflict (id) do update set
    name = excluded.name,
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
where category = 'featured-collection'
on conflict (product_id) do nothing;
