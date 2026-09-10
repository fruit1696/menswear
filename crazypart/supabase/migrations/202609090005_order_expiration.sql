create or replace function public.cancel_pending_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
    target_order public.orders%rowtype;
begin
    select * into target_order
    from public.orders
    where id = p_order_id
      and (user_id = (select auth.uid()) or (select private.is_admin()));

    if not found then
        raise exception 'Order not found';
    end if;

    if target_order.status <> 'pending_payment' then
        return false;
    end if;

    if target_order.stock_allocated and not target_order.stock_released then
        update public.inventory inventory
        set stock_quantity = inventory.stock_quantity + order_item.quantity,
            updated_at = now()
        from public.order_items order_item
        where order_item.order_id = target_order.id
          and inventory.product_id = order_item.product_id;
    end if;

    update public.orders
    set status = 'cancelled', stock_released = true, updated_at = now()
    where id = target_order.id;

    return true;
end;
$$;

create or replace function public.expire_pending_orders()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
    expired_count integer := 0;
    target_order public.orders%rowtype;
begin
    for target_order in
        select * from public.orders
        where status = 'pending_payment'
          and expires_at is not null
          and expires_at <= now()
        for update skip locked
    loop
        if target_order.stock_allocated and not target_order.stock_released then
            update public.inventory inventory
            set stock_quantity = inventory.stock_quantity + order_item.quantity,
                updated_at = now()
            from public.order_items order_item
            where order_item.order_id = target_order.id
              and inventory.product_id = order_item.product_id;
        end if;

        update public.orders
        set status = 'cancelled', stock_released = true, updated_at = now()
        where id = target_order.id;
        expired_count := expired_count + 1;
    end loop;

    return expired_count;
end;
$$;

revoke all on function public.cancel_pending_order(uuid) from public;
grant execute on function public.cancel_pending_order(uuid) to authenticated;
revoke all on function public.expire_pending_orders() from public;
