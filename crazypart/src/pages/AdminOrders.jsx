import React, { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { listAdminOrders, updateAdminOrderStatus } from "@/features/admin/orderAdminService";

const nextStatuses = {
    pending_payment: ["cancelled", "payment_failed"],
    paid: ["processing", "refunded"],
    processing: ["shipped"],
    shipped: ["delivered"],
};

export default function AdminOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");

    const loadOrders = () => listAdminOrders().then(setOrders).catch((loadError) => setError(loadError.message || "Unable to load orders.")).finally(() => setLoading(false));
    useEffect(() => { loadOrders(); }, []);

    const changeStatus = async (orderId, nextStatus) => {
        setSavingId(orderId); setError("");
        try {
            const updated = await updateAdminOrderStatus(orderId, nextStatus);
            setOrders((current) => current.map((order) => order.id === orderId ? updated : order));
        } catch (statusError) {
            setError(statusError.message || "Unable to update order status.");
        } finally { setSavingId(null); }
    };

    return <div className="min-h-screen bg-background px-5 pb-20 pt-32 sm:px-8"><div className="mx-auto max-w-6xl"><div className="border-b border-border/60 pb-8"><p className="text-[11px] uppercase tracking-[0.3em] text-accent">Admin orders</p><h1 className="mt-4 font-display text-4xl font-medium text-foreground sm:text-5xl">Fulfillment</h1><p className="mt-4 text-foreground/65">Move orders through the allowed fulfillment states.</p><p className="mt-2 text-sm text-foreground/50">Signed in as {user?.email}</p></div>{error && <p role="alert" className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{loading ? <div className="flex items-center gap-2 py-12 text-sm text-foreground/60"><Loader2 className="h-4 w-4 animate-spin" /> Loading orders...</div> : <div className="mt-8 overflow-x-auto border border-border/60"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border/60 bg-secondary/40 text-[11px] uppercase tracking-[0.18em] text-foreground/60"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Created</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Transition</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b border-border/40 last:border-0"><td className="px-4 py-4 font-medium text-foreground">{order.order_number}</td><td className="px-4 py-4 text-foreground/60">{new Date(order.created_at).toLocaleDateString()}</td><td className="px-4 py-4 text-foreground/70">₹{Math.round(order.total_paise / 100)}</td><td className="px-4 py-4 capitalize text-foreground/60">{order.status.replaceAll("_", " ")}</td><td className="px-4 py-4">{nextStatuses[order.status]?.length ? <div className="flex items-center gap-2"><select defaultValue="" disabled={savingId === order.id} onChange={(event) => event.target.value && changeStatus(order.id, event.target.value)} aria-label={`Transition ${order.order_number}`} className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"><option value="">Select</option>{nextStatuses[order.status].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select>{savingId === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-foreground/40" />}</div> : <span className="text-foreground/40">No transition</span>}</td></tr>)}</tbody></table></div>}</div></div>;
}
