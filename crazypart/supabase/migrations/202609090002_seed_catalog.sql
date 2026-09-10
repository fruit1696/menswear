insert into public.products (
    id, name, slug, description, price_paise, sku, category, fabric_type, color, status
)
values
    ('10000000-0000-4000-8000-000000000001', 'Raymond 100% Cotton', 'azure-linen', 'A refined Raymond cotton shirting fabric with a clean, versatile finish.', 46000, 'CC-RAY-COTTON-AZURE', 'shirt-fabric', 'cotton', 'azure', 'active'),
    ('10000000-0000-4000-8000-000000000002', 'Raymond Giza Cotton', 'ivory-herringbone', 'A smooth Raymond Giza cotton fabric selected for polished everyday shirts.', 50000, 'CC-RAY-GIZA-IVORY', 'shirt-fabric', 'giza cotton', 'ivory', 'active'),
    ('10000000-0000-4000-8000-000000000003', 'Raymond Pure White', 'slate-evening', 'A crisp Raymond shirting fabric with a clean, bright finish.', 46000, 'CC-RAY-WHITE-SLATE', 'shirt-fabric', 'cotton', 'white', 'active'),
    ('10000000-0000-4000-8000-000000000004', 'Raymond Pure White', 'vibrant-collection', 'A bright Raymond shirting fabric from the selected white collection.', 46000, 'CC-RAY-WHITE-VIBRANT', 'shirt-fabric', 'cotton', 'white', 'active')
on conflict (slug) do update set
    name = excluded.name,
    description = excluded.description,
    price_paise = excluded.price_paise,
    sku = excluded.sku,
    category = excluded.category,
    fabric_type = excluded.fabric_type,
    color = excluded.color,
    status = excluded.status,
    updated_at = now();

insert into public.inventory (product_id, stock_quantity)
select id, 0
from public.products
where slug in ('azure-linen', 'ivory-herringbone', 'slate-evening', 'vibrant-collection')
on conflict (product_id) do nothing;

insert into public.product_images (product_id, object_path, alt_text, sort_order, is_primary)
select products.id, images.object_path, images.alt_text, images.sort_order, images.is_primary
from public.products
join (
    values
        ('azure-linen', 'products/azure-linen/blue1.jpeg', 'Raymond cotton fabric in azure blue', 0, true),
        ('azure-linen', 'products/azure-linen/blue2.jpeg', 'Close view of azure Raymond cotton fabric', 1, false),
        ('azure-linen', 'products/azure-linen/blue3.jpeg', 'Folded azure Raymond cotton fabric', 2, false),
        ('ivory-herringbone', 'products/ivory-herringbone/black1.jpeg', 'Raymond Giza cotton fabric detail', 0, true),
        ('ivory-herringbone', 'products/ivory-herringbone/black2.jpeg', 'Folded Raymond Giza cotton fabric', 1, false),
        ('slate-evening', 'products/slate-evening/white1.jpeg', 'Raymond pure white fabric detail', 0, true),
        ('slate-evening', 'products/slate-evening/white2.jpeg', 'Folded Raymond pure white fabric', 1, false),
        ('slate-evening', 'products/slate-evening/white3.jpeg', 'Raymond pure white fabric texture', 2, false),
        ('vibrant-collection', 'products/vibrant-collection/Awhite1.jpeg', 'Raymond white collection fabric detail', 0, true),
        ('vibrant-collection', 'products/vibrant-collection/Awhite2.jpeg', 'Folded Raymond white collection fabric', 1, false)
) as images(slug, object_path, alt_text, sort_order, is_primary) on images.slug = products.slug
on conflict (object_path) do update set
    product_id = excluded.product_id,
    alt_text = excluded.alt_text,
    sort_order = excluded.sort_order,
    is_primary = excluded.is_primary;