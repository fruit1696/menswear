import React from "react";
import { Link } from "react-router-dom";
import FabricCard from "@/components/FabricCard";
import { useAuth } from "@/lib/AuthContext";
import { useWishlist } from "@/features/wishlist/wishlistQueries";
import { useActiveProducts } from "@/features/products/productQueries";
import { productToFabric } from "@/features/products/productService";

export default function Wishlist() {
    const { isAuthenticated } = useAuth();
    const { productIds, isLoading } = useWishlist();
    const { data: products = [], isLoading: productsLoading } = useActiveProducts();
    const fabrics = products.filter((product) => productIds.includes(product.id)).map(productToFabric);

    if (!isAuthenticated) return <EmptyState title="Sign in to see your wishlist" action="Continue with Google" to="/login?returnTo=%2Fwishlist" />;
    if (isLoading || productsLoading) return <div className="min-h-screen px-5 pb-20 pt-32 text-sm text-foreground/60 sm:px-8">Loading wishlist...</div>;
    if (!fabrics.length) return <EmptyState title="Your wishlist is empty" action="Browse fabrics" to="/fabrics" />;

    return <div className="min-h-screen px-5 pb-20 pt-32 sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-[11px] uppercase tracking-[0.3em] text-accent">Saved for later</p><h1 className="mt-4 font-display text-5xl font-medium text-foreground">Wishlist</h1><div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{fabrics.map((fabric) => <FabricCard key={fabric.id} fabric={fabric} />)}</div></div></div>;
}

function EmptyState({ title, action, to }) {
    return <div className="min-h-screen px-5 pb-20 pt-32 sm:px-8"><div className="mx-auto max-w-xl border-y border-border/60 py-12 text-center"><h1 className="font-display text-3xl text-foreground">{title}</h1><Link to={to} className="mt-6 inline-block border-b border-accent pb-1 text-sm text-foreground">{action}</Link></div></div>;
}
