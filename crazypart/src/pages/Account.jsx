import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { deleteAddress, listAddresses, saveAddress, setDefaultAddress, updateProfile } from "@/features/account/accountService";
import { listMyOrders } from "@/features/orders/orderService";
import Login from "@/pages/Login";

const emptyAddress = { recipient_name: "", phone: "", line1: "", line2: "", city: "", state: "", postal_code: "", country_code: "IN", is_default: false };

export default function Account() {
    const { user, profile, refreshProfile, logout, isLoadingAuth } = useAuth();
    const [profileForm, setProfileForm] = useState({ full_name: profile?.full_name ?? "", phone: profile?.phone ?? "" });
    const [addresses, setAddresses] = useState([]);
    const [addressForm, setAddressForm] = useState(emptyAddress);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [orders, setOrders] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        setProfileForm({ full_name: profile?.full_name ?? "", phone: profile?.phone ?? "" });
    }, [profile]);

    useEffect(() => {
        if (!user) return undefined;
        let active = true;
        Promise.all([listAddresses(user.id), listMyOrders(user.id)])
            .then(([nextAddresses, nextOrders]) => {
                if (!active) return;
                setAddresses(nextAddresses);
                setOrders(nextOrders);
                if (!nextAddresses.length) setShowAddressForm(true);
            })
            .catch((loadError) => active && setError(loadError.message || "Unable to load account details."))
            .finally(() => {
                if (active) {
                    setLoadingAddresses(false);
                    setLoadingOrders(false);
                }
            });
        return () => { active = false; };
    }, [user]);

    if (isLoadingAuth) return <div className="min-h-screen bg-background" aria-busy="true" />;
    if (!user) return <Login mode="account" />;

    const run = async (operation, successMessage) => {
        setError(""); setMessage(""); setSaving(true);
        try { await operation(); setMessage(successMessage); } catch (operationError) { setError(operationError.message || "Unable to save changes."); } finally { setSaving(false); }
    };

    const saveProfile = () => run(async () => { await updateProfile(user.id, profileForm); await refreshProfile(); }, "Profile updated.");
    const submitAddress = (event) => {
        event.preventDefault();
        run(async () => {
            const saved = await saveAddress(user.id, addressForm);
            setAddresses((current) => addressForm.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
            setAddressForm(emptyAddress);
            setShowAddressForm(false);
        }, addressForm.id ? "Address updated." : "Address saved.");
    };
    const removeAddress = (addressId) => run(async () => {
        await deleteAddress(user.id, addressId);
        setAddresses((current) => current.filter((item) => item.id !== addressId));
        if (addressForm.id === addressId) setAddressForm(emptyAddress);
    }, "Address removed.");
    const makeDefault = (addressId) => run(async () => {
        const saved = await setDefaultAddress(user.id, addressId);
        setAddresses((current) => current.map((item) => ({ ...item, is_default: item.id === saved.id })));
    }, "Default address updated.");
    return (
        <div className="min-h-screen px-5 pb-20 pt-32 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border/60 pb-8">
                    <div><p className="text-[11px] uppercase tracking-[0.3em] text-accent">Your account</p><h1 className="mt-4 font-display text-5xl font-medium text-foreground">Account</h1><p className="mt-3 text-sm text-foreground/55">Manage your details, delivery addresses and orders.</p></div>
                    <Button variant="outline" onClick={logout}>Log out</Button>
                </div>
                {error && <p role="alert" className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
                {message && <p role="status" className="mt-6 rounded-md bg-accent/10 p-3 text-sm text-foreground">{message}</p>}
                <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="space-y-10">
                        <section className="border-y border-border/60 py-8"><SectionHeading title="Manage account" /><div className="mt-6 space-y-4"><Field label="Name"><Input value={profileForm.full_name} onChange={(event) => setProfileForm({ ...profileForm, full_name: event.target.value })} autoComplete="name" /></Field><Field label="Email"><Input value={user.email || ""} readOnly aria-readonly="true" className="text-foreground/60" /></Field><Field label="Phone"><Input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} autoComplete="tel" /></Field><p className="text-xs leading-relaxed text-foreground/50">Your email is managed securely by your authenticated Supabase account.</p><Button onClick={saveProfile} disabled={saving}><Save />Save changes</Button></div></section>
                        <section className="border-y border-border/60 py-8"><SectionHeading title="Explore more collection" /><p className="mt-4 text-sm leading-relaxed text-foreground/65">As a registered member, request live photos and explore additional colors, fabrics and styles beyond our curated online collection.</p><Link to="/#pick-your-style" className="mt-6 inline-flex items-center gap-2 border-b border-accent pb-1 text-sm font-medium text-foreground"><ExternalLink className="h-4 w-4" />Request on WhatsApp</Link></section>
                    </div>
                    <section className="border-y border-border/60 py-8"><div className="flex items-center justify-between gap-4"><SectionHeading title="My addresses" /><Button variant="outline" size="sm" onClick={() => { setAddressForm({ ...emptyAddress, recipient_name: profile?.full_name ?? "", phone: profile?.phone ?? "" }); setShowAddressForm(true); }}><Plus />Add address</Button></div>{loadingAddresses ? <p className="mt-6 text-sm text-foreground/60">Loading addresses...</p> : <div className="mt-6 space-y-3">{addresses.length === 0 && !addressForm.id && <p className="text-sm text-foreground/60">No saved addresses yet.</p>}{addresses.map((address) => <AddressCard key={address.id} address={address} onEdit={() => { setAddressForm(address); setShowAddressForm(true); }} onDelete={() => removeAddress(address.id)} onDefault={() => makeDefault(address.id)} saving={saving} />)}</div>}{(showAddressForm || addressForm.id) && <AddressForm address={addressForm} setAddress={setAddressForm} onSubmit={submitAddress} onCancel={() => { setAddressForm(emptyAddress); setShowAddressForm(false); }} saving={saving} />}</section>
                </div>
                <section className="mt-14 border-t border-border/60 pt-10"><SectionHeading title="My orders" />{loadingOrders ? <p className="mt-6 text-sm text-foreground/60">Loading orders...</p> : orders.length === 0 ? <p className="mt-6 text-sm text-foreground/60">No orders yet.</p> : <div className="mt-6 divide-y divide-border/60 border-y border-border/60">{orders.map((order) => <OrderCard key={order.id} order={order} expanded={expandedOrder === order.id} onToggle={() => setExpandedOrder((current) => current === order.id ? null : order.id)} />)}</div>}</section>
            </div>
        </div>
    );
}

function Field({ label, className = "", children }) { return <label className={`block space-y-2 ${className}`}><Label>{label}</Label>{children}</label>; }

function SectionHeading({ title }) { return <h2 className="font-display text-2xl font-medium text-foreground">{title}</h2>; }
function AddressCard({ address, onEdit, onDelete, onDefault, saving }) { return <article className="border border-border/60 p-4"><div className="flex items-start justify-between gap-4"><div className="min-w-0 text-sm leading-relaxed"><div className="flex flex-wrap items-center gap-2"><p className="font-medium text-foreground">{address.recipient_name}</p>{address.is_default && <span className="text-[10px] uppercase tracking-[0.15em] text-accent">Default address</span>}</div><p className="mt-1 text-foreground/65">{address.phone}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />{address.city}, {address.state} {address.postal_code}</p></div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit address"><Pencil /></Button><Button variant="ghost" size="icon" onClick={onDelete} disabled={saving} aria-label="Delete address"><Trash2 /></Button></div></div>{!address.is_default && <button type="button" onClick={onDefault} disabled={saving} className="mt-4 text-xs font-medium text-foreground/65 underline decoration-accent underline-offset-4">Set as default</button>}</article>; }
function AddressForm({ address, setAddress, onSubmit, onCancel, saving }) { return <form onSubmit={onSubmit} className="mt-6 space-y-4 border-t border-border/60 pt-6"><div className="flex items-center justify-between"><h3 className="font-display text-xl text-foreground">{address.id ? "Edit address" : "Add address"}</h3><Button type="button" variant="ghost" size="icon" onClick={onCancel} aria-label="Cancel address"><X /></Button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Recipient name"><Input required value={address.recipient_name} onChange={(event) => setAddress({ ...address, recipient_name: event.target.value })} /></Field><Field label="Recipient phone"><Input required value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} /></Field><Field label="Address line 1" className="sm:col-span-2"><Input required value={address.line1} onChange={(event) => setAddress({ ...address, line1: event.target.value })} /></Field><Field label="Address line 2"><Input value={address.line2 || ""} onChange={(event) => setAddress({ ...address, line2: event.target.value })} /></Field><Field label="City"><Input required value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} /></Field><Field label="State"><Input required value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value })} /></Field><Field label="Postal code"><Input required value={address.postal_code} onChange={(event) => setAddress({ ...address, postal_code: event.target.value })} /></Field></div><label className="flex items-center gap-2 text-sm text-foreground/65"><input type="checkbox" checked={Boolean(address.is_default)} onChange={(event) => setAddress({ ...address, is_default: event.target.checked })} />Save as default address</label><Button type="submit" disabled={saving}><Save />{address.id ? "Update address" : "Save address"}</Button></form>; }
function OrderCard({ order, expanded, onToggle }) { return <article className="py-5"><button type="button" onClick={onToggle} className="flex w-full flex-wrap items-start justify-between gap-4 text-left"><div><p className="font-medium text-foreground">{order.order_number}</p><p className="mt-1 text-sm capitalize text-foreground/55">{new Date(order.created_at).toLocaleDateString()} · {order.status.replaceAll("_", " ")}</p><p className="mt-2 text-sm text-foreground/65">{order.items.map((item) => `${item.product_name} × ${item.quantity}`).join(", ")}</p></div><div className="flex items-center gap-3"><p className="font-medium text-foreground">₹{Math.round(order.total_paise / 100)}</p>{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div></button>{expanded && <div className="mt-5 grid gap-4 border-t border-border/60 pt-5 text-sm text-foreground/65 sm:grid-cols-2"><div><p className="font-medium text-foreground">Order details</p>{order.items.map((item) => <p key={item.id} className="mt-2">{item.product_name} × {item.quantity} · ₹{Math.round(item.line_total_paise / 100)}</p>)}</div><div><p className="font-medium text-foreground">Delivery address</p><p className="mt-2 leading-relaxed">{order.shipping_address?.recipient_name}<br />{order.shipping_address?.phone}<br />{order.shipping_address?.line1}{order.shipping_address?.line2 ? `, ${order.shipping_address.line2}` : ""}<br />{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}</p><p className="mt-3 capitalize">Payment/order status: {order.status.replaceAll("_", " ")}</p></div></div>}</article>; }
