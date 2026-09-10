import React, { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Save, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/features/cart/CartProvider";
import { listAddresses, saveAddress } from "@/features/account/accountService";
import { normalizeQuantity } from "@/features/cart/cartDomain";

const createEmptyAddress = (profile) => ({ recipient_name: profile?.full_name ?? "", phone: profile?.phone ?? "", line1: "", line2: "", city: "", state: "", postal_code: "", country_code: "IN", is_default: false });

export default function Checkout() {
    const { user, profile } = useAuth();
    const { items, isLoading: isCartLoading } = useCart();
    const [searchParams] = useSearchParams();
    const [addresses, setAddresses] = useState([]);
    const [addressId, setAddressId] = useState("");
    const [addressForm, setAddressForm] = useState(() => createEmptyAddress(null));
    const [sameAsProfilePhone, setSameAsProfilePhone] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const buyNowProductId = searchParams.get("buyNow");
    const checkoutItems = buyNowProductId
        ? [{ productId: buyNowProductId, quantity: normalizeQuantity(searchParams.get("quantity")) }]
        : items;

    useEffect(() => {
        listAddresses(user.id)
            .then((nextAddresses) => {
                setAddresses(nextAddresses);
                setAddressId(nextAddresses.find((address) => address.is_default)?.id ?? nextAddresses[0]?.id ?? "");
                if (!nextAddresses.length) {
                    setAddressForm(createEmptyAddress(profile));
                    setSameAsProfilePhone(Boolean(profile?.phone));
                    setShowAddressForm(true);
                }
            })
            .catch((loadError) => setError(loadError.message || "Unable to load addresses."))
            .finally(() => setLoading(false));
    }, [profile, user.id]);

    const startNewAddress = () => {
        setAddressForm(createEmptyAddress(profile));
        setSameAsProfilePhone(Boolean(profile?.phone));
        setShowAddressForm(true);
    };

    const editAddress = (address) => {
        setAddressForm(address);
        setSameAsProfilePhone(Boolean(profile?.phone && address.phone === profile.phone));
        setShowAddressForm(true);
    };

    const submitAddress = async () => {
        setError("");
        setSubmitting(true);
        try {
            const saved = await saveAddress(user.id, addressForm);
            setAddresses((current) => addressForm.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
            setAddressId(saved.id);
            setAddressForm(createEmptyAddress(profile));
            setSameAsProfilePhone(false);
            setShowAddressForm(false);
        } catch (saveError) {
            setError(saveError.message || "Unable to save the delivery address.");
        } finally {
            setSubmitting(false);
        }
    };

    const selectedAddress = addresses.find((address) => address.id === addressId);

    if (isCartLoading || loading) return <div className="min-h-screen px-5 pb-20 pt-32 text-sm text-foreground/60 sm:px-8">Loading checkout...</div>;

    return (
        <div className="min-h-screen px-5 pb-20 pt-32 sm:px-8"><div className="mx-auto max-w-3xl"><p className="text-[11px] uppercase tracking-[0.3em] text-accent">Checkout</p><h1 className="mt-4 font-display text-5xl text-foreground">Delivery details</h1>{error && <p role="alert" className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{!checkoutItems.length ? <div className="mt-10 border-y border-border/60 py-10 text-center"><p className="text-foreground/65">Your cart is empty.</p><Link to="/fabrics" className="mt-5 inline-block border-b border-accent pb-1 text-sm">Browse fabrics</Link></div> : <div className="mt-10 space-y-6"><div className="flex items-end justify-between gap-4"><label className="block flex-1 space-y-2"><span className="text-sm font-medium">Shipping address</span><select required={addresses.length > 0} value={addressId} onChange={(event) => setAddressId(event.target.value)} className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="">Select an address</option>{addresses.map((address) => <option key={address.id} value={address.id}>{address.recipient_name} · {address.city}, {address.state}</option>)}</select></label>{addresses.length > 0 && <Button type="button" variant="outline" onClick={startNewAddress}><Plus />Add address</Button>}</div>{selectedAddress && <div className="flex items-start justify-between gap-4 border border-border/60 p-4 text-sm leading-relaxed text-foreground/65"><div>{selectedAddress.recipient_name} · {selectedAddress.phone}<br />{selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}<br />{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}</div><Button type="button" variant="ghost" size="icon" onClick={() => editAddress(selectedAddress)} aria-label="Edit address"><Pencil /></Button></div>}{showAddressForm && <div className="space-y-4 border-t border-border/60 pt-6"><div className="flex items-center justify-between"><h2 className="font-display text-2xl text-foreground">{addressForm.id ? "Edit delivery address" : "Add delivery address"}</h2>{addresses.length > 0 && <Button type="button" variant="ghost" size="icon" onClick={() => { setShowAddressForm(false); setAddressForm(createEmptyAddress(profile)); setSameAsProfilePhone(false); }} aria-label="Cancel address"><X /></Button>}</div><div className="grid gap-4 sm:grid-cols-2"><Field label="Recipient name"><Input required value={addressForm.recipient_name} onChange={(event) => setAddressForm({ ...addressForm, recipient_name: event.target.value })} /></Field><div className="space-y-3"><Field label="Recipient Phone"><Input required value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} /></Field><label className="flex items-center gap-2 text-sm text-foreground/65"><input type="checkbox" checked={sameAsProfilePhone} disabled={!profile?.phone} onChange={(event) => { const checked = event.target.checked; setSameAsProfilePhone(checked); if (checked) setAddressForm((current) => ({ ...current, phone: profile.phone })); }} />Same as profile phone number</label></div><Field label="Address line 1" className="sm:col-span-2"><Input required value={addressForm.line1} onChange={(event) => setAddressForm({ ...addressForm, line1: event.target.value })} /></Field><Field label="Address line 2"><Input value={addressForm.line2} onChange={(event) => setAddressForm({ ...addressForm, line2: event.target.value })} /></Field><Field label="City"><Input required value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} /></Field><Field label="State"><Input required value={addressForm.state} onChange={(event) => setAddressForm({ ...addressForm, state: event.target.value })} /></Field><Field label="Postal code"><Input required value={addressForm.postal_code} onChange={(event) => setAddressForm({ ...addressForm, postal_code: event.target.value })} /></Field></div><Button type="button" onClick={submitAddress} disabled={submitting}>{submitting ? <Loader2 className="animate-spin" /> : <Save />}{addressForm.id ? "Update address" : "Save address"}</Button></div>}</div>}</div></div>
    );
}

function Field({ label, className = "", children }) { return <label className={`block space-y-2 ${className}`}><Label>{label}</Label>{children}</label>; }
