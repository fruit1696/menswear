create or replace function public.update_order_status(
    p_order_id uuid,
    p_next_status text
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_order public.orders%rowtype;
begin
    if not (select private.is_admin()) then
        raise exception 'Admin access required';
    end if;

    select * into current_order from public.orders where id = p_order_id for update;
    if not found then
        raise exception 'Order not found';
    end if;

    if not (
        (current_order.status = 'pending_payment' and p_next_status in ('cancelled', 'payment_failed')) or
        (current_order.status = 'paid' and p_next_status in ('processing', 'refunded')) or
        (current_order.status = 'processing' and p_next_status = 'shipped') or
        (current_order.status = 'shipped' and p_next_status = 'delivered')
    ) then
        raise exception 'Invalid order status transition';
    end if;

    update public.orders
    set status = p_next_status, updated_at = now()
    where id = p_order_id
    returning * into current_order;

    return current_order;
end;
$$;

revoke all on function public.update_order_status(uuid, text) from public;
grant execute on function public.update_order_status(uuid, text) to authenticated;
revoke update on public.orders from authenticated;
