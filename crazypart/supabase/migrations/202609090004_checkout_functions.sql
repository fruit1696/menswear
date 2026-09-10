create or replace function public.create_pending_order(
    p_items jsonb,
    p_shipping_address jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_user_id uuid := (select auth.uid());
    new_order_id uuid;
    new_order_number text;
    item_record record;
    product_record record;
    subtotal_amount bigint := 0;
    line_total bigint;
begin
    if current_user_id is null then
        raise exception 'Authentication required';
    end if;

    if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
        raise exception 'Cart cannot be empty';
    end if;

    if jsonb_typeof(p_shipping_address) <> 'object' then
        raise exception 'A shipping address is required';
    end if;

    -- Lock every inventory row in deterministic product order before calculating totals.
    for item_record in
        select product_id, sum(quantity)::integer as quantity
        from jsonb_to_recordset(p_items) as requested(product_id uuid, quantity integer)
        group by product_id
        order by product_id
    loop
        if item_record.quantity is null or item_record.quantity < 1 or item_record.quantity > 50 then
            raise exception 'Invalid product quantity';
        end if;

        select p.id, p.name, p.sku, p.category, p.fabric_type, p.color, p.pattern,
               p.price_paise, i.stock_quantity
        into product_record
        from public.products p
        join public.inventory i on i.product_id = p.id
        where p.id = item_record.product_id and p.status = 'active'
        for update of p, i;

        if not found then
            raise exception 'Product is unavailable';
        end if;

        if product_record.stock_quantity < item_record.quantity then
            raise exception 'Insufficient stock for %', product_record.name;
        end if;

        subtotal_amount := subtotal_amount + (product_record.price_paise * item_record.quantity);
    end loop;

    new_order_id := gen_random_uuid();
    new_order_number := 'CC-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || upper(substr(new_order_id::text, 1, 8));

    insert into public.orders (
        id, order_number, user_id, status, subtotal_paise, shipping_paise, total_paise,
        currency, shipping_address, stock_allocated, expires_at
    ) values (
        new_order_id, new_order_number, current_user_id, 'pending_payment',
        subtotal_amount, 0, subtotal_amount, 'INR', p_shipping_address,
        true, now() + interval '30 minutes'
    );

    for item_record in
        select product_id, sum(quantity)::integer as quantity
        from jsonb_to_recordset(p_items) as requested(product_id uuid, quantity integer)
        group by product_id
        order by product_id
    loop
        select p.name, p.sku, p.category, p.fabric_type, p.color, p.pattern, p.price_paise
        into product_record
        from public.products p
        where p.id = item_record.product_id;

        line_total := product_record.price_paise * item_record.quantity;
        insert into public.order_items (
            order_id, product_id, product_name, sku, category, fabric_type, color, pattern,
            unit_price_paise, quantity, line_total_paise
        ) values (
            new_order_id, item_record.product_id, product_record.name, product_record.sku,
            product_record.category, product_record.fabric_type, product_record.color,
            product_record.pattern, product_record.price_paise, item_record.quantity, line_total
        );

        update public.inventory
        set stock_quantity = stock_quantity - item_record.quantity,
            updated_at = now()
        where product_id = item_record.product_id;
    end loop;

    return jsonb_build_object(
        'id', new_order_id,
        'order_number', new_order_number,
        'status', 'pending_payment',
        'total_paise', subtotal_amount,
        'currency', 'INR',
        'expires_at', now() + interval '30 minutes'
    );
end;
$$;

revoke all on function public.create_pending_order(jsonb, jsonb) from public;
grant execute on function public.create_pending_order(jsonb, jsonb) to authenticated;
