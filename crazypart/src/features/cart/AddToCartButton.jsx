import { ArrowRight, Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/CartProvider";

export default function AddToCartButton({ productId, product, compact = false }) {
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    if (!productId) return null;

    const handleAdd = async () => {
        await addItem(productId, quantity, product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
    };

    const handleBuyNow = () => {
        navigate(`/checkout?buyNow=${encodeURIComponent(productId)}&quantity=${quantity}`);
    };

    return <div className={compact ? "" : "mt-4 flex flex-wrap items-center gap-3"}>
        {!compact && <div className="flex items-center border border-input"><button type="button" className="h-10 w-10" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity">−</button><span className="w-8 text-center text-sm">{quantity}</span><button type="button" className="h-10 w-10" onClick={() => setQuantity((current) => Math.min(50, current + 1))} aria-label="Increase quantity">+</button></div>}
        <>
            <Button type="button" onClick={handleAdd} size={compact ? "sm" : "default"} className={compact ? "" : "w-full sm:w-auto"} aria-label="Add product to cart">
                {added ? <Check /> : <ShoppingBag />}{added ? "Added to cart" : "Add to cart"}
            </Button>
            <Button type="button" variant="outline" onClick={handleBuyNow} size={compact ? "sm" : "default"} className={compact ? "" : "w-full sm:w-auto"} aria-label="Buy product now">
                <ArrowRight />Buy Now
            </Button>
        </>
    </div>;
}
