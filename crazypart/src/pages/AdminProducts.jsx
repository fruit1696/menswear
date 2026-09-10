import React, { useEffect, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { listAdminProducts, updateAdminProduct } from "@/features/admin/productAdminService";

export default function AdminProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [drafts, setDrafts] = useState({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [savedId, setSavedId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        listAdminProducts().then((next) => { setProducts(next); setDrafts(Object.fromEntries(next.map((product) => [product.id, { name: product.name, description: product.description, price_paise: String(product.price_paise), status: product.status }]))); }).catch((loadError) => setError(loadError.message || "Unable to load products.")).finally(() => setLoading(false));
    }, []);

    const save = async (productId) => {
        const draft = drafts[productId];
        const price = Number.parseInt(draft.price_paise, 10);
        if (!draft.name.trim() || !Number.isInteger(price) || price < 0) { setError("Name and a valid non-negative price are required."); return; }
        setSavingId(productId); setError("");
        try { const updated = await updateAdminProduct(productId, { ...draft, price_paise: price }); setProducts((current) => current.map((product) => product.id === productId ? { ...product, ...updated } : product)); setSavedId(productId); } catch (saveError) { setError(saveError.message || "Unable to save product."); } finally { setSavingId(null); window.setTimeout(() => setSavedId((current) => current === productId ? null : current), 1500); }
    };

    return <div className="min-h-screen bg-background px-5 pb-20 pt-32 sm:px-8"><div className="mx-auto max-w-6xl"><div className="border-b border-border/60 pb-8"><p className="text-[11px] uppercase tracking-[0.3em] text-accent">Admin catalog</p><h1 className="mt-4 font-display text-4xl font-medium text-foreground sm:text-5xl">Product management</h1><p className="mt-4 text-foreground/65">Edit catalog details and publication status.</p><p className="mt-2 text-sm text-foreground/50">Signed in as {user?.email}</p></div>{error && <p role="alert" className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{loading ? <div className="flex items-center gap-2 py-12 text-sm text-foreground/60"><Loader2 className="h-4 w-4 animate-spin" /> Loading products...</div> : <div className="mt-8 space-y-6">{products.map((product) => <article key={product.id} className="border border-border/60 p-5"><div className="grid gap-4 lg:grid-cols-[1fr_1fr_150px_150px_auto] lg:items-end"><label className="space-y-2 text-sm"><span className="text-foreground/60">Name</span><Input value={drafts[product.id]?.name ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [product.id]: { ...current[product.id], name: event.target.value } }))} /></label><label className="space-y-2 text-sm"><span className="text-foreground/60">Description</span><Textarea value={drafts[product.id]?.description ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [product.id]: { ...current[product.id], description: event.target.value } }))} /></label><label className="space-y-2 text-sm"><span className="text-foreground/60">Price (paise)</span><Input type="number" min="0" value={drafts[product.id]?.price_paise ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [product.id]: { ...current[product.id], price_paise: event.target.value } }))} /></label><label className="space-y-2 text-sm"><span className="text-foreground/60">Status</span><select value={drafts[product.id]?.status ?? product.status} onChange={(event) => setDrafts((current) => ({ ...current, [product.id]: { ...current[product.id], status: event.target.value } }))} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option></select></label><Button onClick={() => save(product.id)} disabled={savingId === product.id}>{savingId === product.id ? <Loader2 className="animate-spin" /> : savedId === product.id ? <Check /> : <Save />}<span className="sr-only">Save {product.name}</span></Button></div><p className="mt-3 text-xs text-foreground/45">SKU: {product.sku} · Slug: {product.slug}</p></article>)}</div>}</div></div>;
}
