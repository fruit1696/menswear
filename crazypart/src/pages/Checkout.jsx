import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, Loader2, Pencil, Plus, Save, ShieldCheck, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/features/cart/CartProvider";
import { listAddresses, saveAddress } from "@/features/account/accountService";
import { normalizeQuantity, toCartProduct } from "@/features/cart/cartDomain";
import { createOrderAndPay } from "@/features/checkout/checkoutService";
import { useActiveProducts } from "@/features/products/productQueries";
import { productToFabric } from "@/features/products/productService";
import { FABRICS } from "@/lib/brand";
import { FULL_COLLECTION } from "@/lib/featuredCollections";

const emptyAddress = (profile) => ({ recipient_name: profile?.full_name ?? "", phone: profile?.phone ?? "", line1: "", line2: "", city: "", state: "", postal_code: "", country_code: "IN", is_default: false });

export default function Checkout() {
    const { user, profile } = useAuth();
    const { items, isLoading: cartLoading, clearCart, removeItem } = useCart();
    const { data: products = [], isLoading: productsLoading } = useActiveProducts();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [addressId, setAddressId] = useState("");
    const [form, setForm] = useState(() => emptyAddress(null));
    const [samePhone, setSamePhone] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");
    const buyNowId = params.get("buyNow");

    const productsById = useMemo(() => new Map([
        ...FABRICS.map((p) => [p.productId, { ...p, ...toCartProduct(p) }]),
        ...FULL_COLLECTION.varieties.map((p) => [p.productId, { ...p, ...toCartProduct(p) }]),
        ...products.map((p) => { const fabric = productToFabric(p); return [p.id, { ...fabric, price_paise: p.price_paise }]; }),
    ]), [products]);

    const checkoutItems = buyNowId
        ? [{ productId: buyNowId, quantity: normalizeQuantity(params.get("quantity")), product: items.find((item) => item.productId === buyNowId)?.product }]
        : items;
    const lines = checkoutItems.map((item) => ({ item, product: item.product ?? productsById.get(item.productId) })).filter(({ product }) => product);
    const subtotal = lines.reduce((total, { item, product }) => total + product.price_paise * item.quantity, 0);

    useEffect(() => {
        listAddresses(user.id).then((next) => {
            setAddresses(next);
            setAddressId(next.find((address) => address.is_default)?.id ?? next[0]?.id ?? "");
            if (!next.length) { setForm(emptyAddress(profile)); setSamePhone(Boolean(profile?.phone)); setShowForm(true); }
        }).catch((loadError) => setError(loadError.message || "Unable to load addresses.")).finally(() => setLoading(false));
    }, [profile, user.id]);

    const saveShippingAddress = async () => {
        setError(""); setSaving(true);
        try {
            const saved = await saveAddress(user.id, form);
            setAddresses((current) => form.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
            setAddressId(saved.id); setForm(emptyAddress(profile)); setSamePhone(false); setShowForm(false);
        } catch (saveError) { setError(saveError.message || "Unable to save the delivery address."); }
        finally { setSaving(false); }
    };

    const selectedAddress = addresses.find((address) => address.id === addressId);
    const payNow = async () => {
        if (!selectedAddress) return setError("Add and select a shipping address before paying.");
        setError(""); setPaying(true);
        try {
            const result = await createOrderAndPay({ items: checkoutItems, shippingAddress: selectedAddress, customer: { name: selectedAddress.recipient_name, email: user.email, phone: selectedAddress.phone } });
            if (buyNowId) await removeItem(buyNowId); else await clearCart();
            navigate(`/order-confirmation/${result.order_id}`, { replace: true });
        } catch (paymentError) { setError(paymentError.message || "Unable to complete payment."); setPaying(false); }
    };

    if (cartLoading || productsLoading || loading) return <div className="min-h-screen px-5 pb-20 pt-32 text-sm text-foreground/60 sm:px-8">Loading checkout...</div>;

    return <div className="min-h-screen bg-secondary/20 px-5 pb-20 pt-32 sm:px-8"><div className="mx-auto max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Secure checkout</p><h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">Review and pay</h1>
        {error && <p role="alert" className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {!lines.length ? <EmptyCart /> : <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="space-y-8">
                <section className="rounded-lg border border-border/60 bg-background p-5 sm:p-6"><h2 className="font-display text-2xl">Your products</h2><div className="mt-5 divide-y divide-border/50">{lines.map(({ item, product }) => <div key={item.productId} className="flex gap-4 py-5 first:pt-0 last:pb-0"><img src={product.image ?? product.images?.[0]} alt={product.name} className="h-28 w-20 flex-none rounded-md object-cover" /><div className="min-w-0 flex-1"><h3 className="font-medium">{product.name}</h3><p className="mt-2 text-sm text-foreground/55">₹{Math.round(product.price_paise / 100)} / 2-piece</p><p className="mt-1 text-sm text-foreground/55">Quantity: {item.quantity}</p></div><strong className="text-sm">₹{Math.round(product.price_paise * item.quantity / 100)}</strong></div>)}</div></section>
                <section className="rounded-lg border border-border/60 bg-background p-5 sm:p-6">
                    <div className="flex items-end justify-between gap-4"><div><h2 className="font-display text-2xl">Customer & shipping information</h2><p className="mt-1 text-sm text-foreground/55">{user.email}</p></div>{addresses.length > 0 && <Button type="button" variant="outline" onClick={() => { setForm(emptyAddress(profile)); setShowForm(true); }}><Plus />Add address</Button>}</div>
                    {addresses.length > 0 && <label className="mt-5 block space-y-2"><span className="text-sm font-medium">Shipping address</span><select value={addressId} onChange={(event) => setAddressId(event.target.value)} className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm">{addresses.map((address) => <option key={address.id} value={address.id}>{address.recipient_name} · {address.city}, {address.state}</option>)}</select></label>}
                    {selectedAddress && !showForm && <div className="mt-4 flex justify-between gap-4 rounded-md bg-secondary/40 p-4 text-sm leading-relaxed text-foreground/65"><div>{selectedAddress.recipient_name} · {selectedAddress.phone}<br />{selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}<br />{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}</div><Button type="button" variant="ghost" size="icon" onClick={() => { setForm(selectedAddress); setShowForm(true); }} aria-label="Edit address"><Pencil /></Button></div>}
                    {showForm && <AddressForm form={form} setForm={setForm} profile={profile} samePhone={samePhone} setSamePhone={setSamePhone} saving={saving} onSave={saveShippingAddress} onCancel={addresses.length ? () => setShowForm(false) : null} />}
                </section>
                <section className="rounded-lg border border-border/60 bg-background p-5 sm:p-6"><h2 className="font-display text-2xl">Payment method</h2><div className="mt-4 flex items-center gap-3 rounded-md border border-foreground/20 p-4"><CreditCard className="h-5 w-5 text-accent" /><div><p className="text-sm font-medium">Razorpay secure payment</p><p className="mt-1 text-xs text-foreground/50">UPI, cards, net banking, and supported wallets</p></div></div></section>
            </div>
            <aside className="h-fit rounded-lg border border-border/60 bg-background p-5 lg:sticky lg:top-28 sm:p-6"><h2 className="font-display text-2xl">Order summary</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span>₹{Math.round(subtotal / 100)}</span></div><div className="flex justify-between"><span className="text-foreground/60">Shipping</span><span className="font-medium text-green-700">Free Shipping</span></div></div><div className="mt-5 flex justify-between border-t border-border/60 pt-5"><strong>Total</strong><strong className="font-display text-2xl">₹{Math.round(subtotal / 100)}</strong></div><Button type="button" size="lg" className="mt-6 h-12 w-full" onClick={payNow} disabled={paying || !selectedAddress}>{paying ? <Loader2 className="animate-spin" /> : <ShieldCheck />}{paying ? "Processing…" : "Place Order / Pay Now"}</Button><p className="mt-3 text-center text-xs text-foreground/45">Your payment is verified securely before the order is confirmed.</p></aside>
        </div>}
    </div></div>;
}

function EmptyCart() { return <div className="mt-10 border-y border-border/60 py-10 text-center"><p className="text-foreground/65">Your cart is empty.</p><Link to="/fabrics" className="mt-5 inline-block border-b border-accent pb-1 text-sm">Browse fabrics</Link></div>; }

function AddressForm({ form, setForm, profile, samePhone, setSamePhone, saving, onSave, onCancel }) {
    return <div className="mt-6 space-y-4 border-t border-border/60 pt-6"><div className="flex justify-between"><h3 className="font-display text-xl">{form.id ? "Edit address" : "Add address"}</h3>{onCancel && <Button type="button" variant="ghost" size="icon" onClick={onCancel} aria-label="Cancel"><X /></Button>}</div><div className="grid gap-4 sm:grid-cols-2"><Field label="Recipient name"><Input required value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} /></Field><div className="space-y-3"><Field label="Recipient phone"><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field><label className="flex items-center gap-2 text-sm text-foreground/65"><input type="checkbox" checked={samePhone} disabled={!profile?.phone} onChange={(e) => { setSamePhone(e.target.checked); if (e.target.checked) setForm({ ...form, phone: profile.phone }); }} />Same as profile phone</label></div><Field label="Address line 1" className="sm:col-span-2"><Input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></Field><Field label="Address line 2"><Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} /></Field><Field label="City"><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field><Field label="State"><Input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></Field><Field label="Postal code"><Input required value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} /></Field></div><Button type="button" onClick={onSave} disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />}{form.id ? "Update address" : "Save address"}</Button></div>;
}

function Field({ label, className = "", children }) { return <label className={`block space-y-2 ${className}`}><Label>{label}</Label>{children}</label>; }
