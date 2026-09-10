import React, { useEffect, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { listAdminProducts, updateProductInventory } from "@/features/admin/productAdminService";

export default function AdminCatalog() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [savedId, setSavedId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        listAdminProducts()
            .then((nextProducts) => {
                if (!active) return;
                setProducts(nextProducts);
                setQuantities(Object.fromEntries(nextProducts.map((product) => [
                    product.id,
                    String(product.inventory?.stock_quantity ?? 0),
                ])));
            })
            .catch((loadError) => active && setError(loadError.message || "Unable to load catalog."))
            .finally(() => active && setLoading(false));

        return () => { active = false; };
    }, []);

    const saveQuantity = async (productId) => {
        const quantity = Number.parseInt(quantities[productId], 10);
        if (!Number.isInteger(quantity) || quantity < 0) {
            setError("Stock quantity must be a whole number of zero or more.");
            return;
        }

        setError("");
        setSavingId(productId);
        try {
            await updateProductInventory(productId, quantity);
            setSavedId(productId);
            setProducts((current) => current.map((product) => product.id === productId
                ? { ...product, inventory: { ...product.inventory, product_id: productId, stock_quantity: quantity } }
                : product));
        } catch (saveError) {
            setError(saveError.message || "Unable to save inventory.");
        } finally {
            setSavingId(null);
            window.setTimeout(() => setSavedId((current) => current === productId ? null : current), 1500);
        }
    };

    return (
        <div className="min-h-screen bg-background px-5 pb-20 pt-32 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="border-b border-border/60 pb-8">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Admin catalog</p>
                    <h1 className="mt-4 font-display text-4xl font-medium text-foreground sm:text-5xl">Products & inventory</h1>
                    <p className="mt-4 max-w-2xl text-foreground/65">Manage authoritative stock quantities for the Crazy Cutpiece catalog.</p>
                    <p className="mt-2 text-sm text-foreground/50">Signed in as {user?.email}</p>
                </div>

                {error && <p role="alert" className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
                {loading ? (
                    <div className="flex items-center gap-2 py-12 text-sm text-foreground/60"><Loader2 className="h-4 w-4 animate-spin" /> Loading catalog...</div>
                ) : (
                    <div className="mt-8 overflow-x-auto border border-border/60">
                        <table className="w-full min-w-[680px] text-left text-sm">
                            <thead className="border-b border-border/60 bg-secondary/40 text-[11px] uppercase tracking-[0.18em] text-foreground/60">
                                <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3" /></tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-border/40 last:border-0">
                                        <td className="px-4 py-4 font-medium text-foreground">{product.name}</td>
                                        <td className="px-4 py-4 text-foreground/60">{product.sku}</td>
                                        <td className="px-4 py-4 capitalize text-foreground/60">{product.status}</td>
                                        <td className="px-4 py-4"><Input type="number" min="0" value={quantities[product.id] ?? "0"} onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: event.target.value }))} className="w-28" aria-label={`Stock quantity for ${product.name}`} /></td>
                                        <td className="px-4 py-4 text-right"><Button size="sm" onClick={() => saveQuantity(product.id)} disabled={savingId === product.id}>{savingId === product.id ? <Loader2 className="animate-spin" /> : savedId === product.id ? <Check /> : <Save />}<span className="sr-only">Save stock for {product.name}</span></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
