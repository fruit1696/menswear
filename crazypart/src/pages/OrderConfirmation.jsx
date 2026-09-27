import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { getMyOrder } from "@/features/orders/orderService";

export default function OrderConfirmation() {
    const { orderId } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        getMyOrder(user.id, orderId).then((data) => {
            if (!data || data.status !== "paid") throw new Error("Confirmed order not found.");
            setOrder(data);
        }).catch((loadError) => setError(loadError.message || "Unable to load order confirmation.")).finally(() => setLoading(false));
    }, [orderId, user.id]);

    if (loading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin" /></div>;
    if (error) return <div className="min-h-[70vh] px-5 pb-20 pt-36 text-center"><h1 className="font-display text-4xl">Order confirmation unavailable</h1><p className="mt-4 text-sm text-foreground/60">{error}</p><Link to="/account" className="mt-6 inline-block border-b border-accent pb-1 text-sm">View your account</Link></div>;

    const address = order.shipping_address;
    return <main className="min-h-screen bg-secondary/20 px-5 pb-20 pt-32 sm:px-8"><div className="mx-auto max-w-3xl">
        <div className="text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-green-700" /><p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-accent">Payment successful</p><h1 className="mt-3 font-display text-4xl sm:text-5xl">Order Confirmed</h1><p className="mt-4 text-foreground/60">Thank you. Your order <strong className="text-foreground">{order.order_number}</strong> has been confirmed.</p></div>
        <div className="mt-10 rounded-lg border border-border/60 bg-background p-5 sm:p-7">
            <h2 className="font-display text-2xl">Order details</h2><div className="mt-5 divide-y divide-border/50">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 py-4"><div><p className="font-medium">{item.product_name}</p><p className="mt-1 text-sm text-foreground/55">Quantity: {item.quantity} · ₹{Math.round(item.unit_price_paise / 100)} each</p></div><strong>₹{Math.round(item.line_total_paise / 100)}</strong></div>)}</div>
            <div className="mt-5 space-y-3 border-t border-border/60 pt-5 text-sm"><div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span>₹{Math.round(order.subtotal_paise / 100)}</span></div><div className="flex justify-between"><span className="text-foreground/60">Shipping</span><span className="font-medium text-green-700">Free Shipping</span></div><div className="flex justify-between border-t border-border/60 pt-4 text-base"><strong>Total paid</strong><strong>₹{Math.round(order.total_paise / 100)}</strong></div></div>
        </div>
        <div className="mt-6 rounded-lg border border-border/60 bg-background p-5 text-sm leading-relaxed text-foreground/65 sm:p-7"><h2 className="font-display text-2xl text-foreground">Shipping to</h2><p className="mt-4">{address?.recipient_name}<br />{address?.phone}<br />{address?.line1}{address?.line2 ? `, ${address.line2}` : ""}<br />{address?.city}, {address?.state} {address?.postal_code}</p></div>
        <div className="mt-8 flex justify-center gap-4"><Link to="/account" className="rounded-md bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-foreground/90">View Orders</Link><Link to="/fabrics" className="rounded-md border border-input px-6 py-3 text-sm font-medium hover:border-foreground/50">Continue Shopping</Link></div>
    </div></main>;
}
