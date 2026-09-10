import React from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/CartProvider";
import { useActiveProducts } from "@/features/products/productQueries";
import { productToFabric } from "@/features/products/productService";
import { toCartProduct } from "@/features/cart/cartDomain";
import { FABRICS } from "@/lib/brand";

export default function Cart() {
    const { items, setQuantity, removeItem, isLoading } = useCart();
    const { data: products = [] } = useActiveProducts();
    const productById = new Map([
        ...FABRICS.map((product) => [product.productId, { ...product, ...toCartProduct(product) }]),
        ...products.map((product) => [product.id, {
            ...productToFabric(product),
            price_paise: product.price_paise,
        }]),
    ]);
    const lines = items.map((item) => ({
        item,
        product: item.product ?? productById.get(item.productId),
    })).filter((line) => line.product);
    const subtotal = lines.reduce((total, { item, product }) => total + product.price_paise * item.quantity, 0);

    return (
        <div className="min-h-screen px-5 pb-20 pt-32 sm:px-8">
            <div className="mx-auto max-w-4xl">
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Your selection</p>
                <h1 className="mt-4 font-display text-5xl font-medium text-foreground">Cart</h1>
                {isLoading && <p className="mt-6 text-sm text-foreground/60">Syncing your cart...</p>}
                {!isLoading && !lines.length && (
                    <div className="mt-12 border-y border-border/60 py-12 text-center">
                        <p className="text-foreground/65">Your cart is empty.</p>
                        <Link to="/fabrics" className="mt-6 inline-block border-b border-accent pb-1 text-sm text-foreground">Browse fabrics</Link>
                    </div>
                )}
                {!!lines.length && (
                    <div className="mt-10 divide-y divide-border/60 border-y border-border/60">
                        {lines.map(({ item, product }) => (
                            <div key={item.productId} className="flex items-center gap-4 py-5 sm:gap-6">
                                <img src={product.image} alt={product.name} className="h-20 w-16 shrink-0 rounded-sm object-cover" />
                                <div className="min-w-0 flex-1"><h2 className="font-display text-xl text-foreground">{product.name}</h2><p className="mt-1 text-sm text-foreground/55">₹{Math.round(product.price_paise / 100)} per 2-piece</p></div>
                                <div className="flex items-center border border-input"><button type="button" className="h-9 w-9" onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label={`Decrease quantity of ${product.name}`}>−</button><span className="w-8 text-center text-sm">{item.quantity}</span><button type="button" className="h-9 w-9" onClick={() => setQuantity(item.productId, item.quantity + 1)} aria-label={`Increase quantity of ${product.name}`}>+</button></div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.productId)} aria-label={`Remove ${product.name} from cart`}><Trash2 /></Button>
                            </div>
                        ))}
                    </div>
                )}
                {!!lines.length && <div className="mt-8 border-t border-border/60 pt-6"><div className="flex items-center justify-between text-base"><span className="text-foreground/65">Subtotal</span><strong className="font-display text-2xl text-foreground">₹{Math.round(subtotal / 100)}</strong></div><p className="mt-2 text-xs text-foreground/50">Final stock and price are confirmed securely at checkout.</p><Link to="/checkout" className="mt-6 inline-flex items-center justify-center border-b border-accent pb-1 text-sm font-medium text-foreground">Proceed to checkout</Link></div>}
            </div>
        </div>
    );
}
