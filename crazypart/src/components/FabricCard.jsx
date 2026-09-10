import React, { useState } from "react";
import FabricCarousel from "@/components/FabricCarousel";
import { fabricImages } from "@/lib/brand";
import WishlistButton from "@/features/wishlist/WishlistButton";
import AddToCartButton from "@/features/cart/AddToCartButton";
import { useCart } from "@/features/cart/CartProvider";
import { Check, Loader2, ShoppingBag, Star } from "lucide-react";
import { listProductReviews } from "@/features/reviews/reviewService";
import { Link, useNavigate } from "react-router-dom";

/**
 * Reusable fabric card. Pass a fabric object from src/lib/brand.js.
 * The image area is a multi-image carousel (touch/swipe + arrows + dots).
 * Existing info is preserved: name, code, tone, description, WhatsApp CTA.
 */
export default function FabricCard({ fabric, onSelectFabric, customerPick = false }) {
    const images = fabricImages(fabric);
    const navigate = useNavigate();
    const rating = useProductRating(fabric.productId);

    const handleImageClick = (event) => {
        if (event?.target.closest("button, a")) return;
        if (customerPick) {
            navigate(`/fabrics/${fabric.id}`);
            return;
        }
        onSelectFabric?.(fabric);
    };

    return (
        <article className="group flex flex-col">
            <div
                        className={`relative overflow-hidden swatch-shadow cursor-pointer ${customerPick ? "rounded-t-xl" : "rounded-sm"}`}
                onClick={handleImageClick}
                role={customerPick ? "link" : undefined}
                tabIndex={customerPick ? 0 : undefined}
                onKeyDown={customerPick ? (event) => {
                    if (event.key === "Enter" || event.key === " ") handleImageClick(event);
                } : undefined}
            >
                <WishlistButton productId={fabric.productId} productName={fabric.name} compact={customerPick} />
                <FabricCarousel
                    images={images}
                    altBase={`${fabric.name} — Raymond shirt fabric, 2-piece cut`}
                    badge={customerPick ? undefined : "2-PIECE SHIRT"}
                    square={customerPick}
                />
                <ReviewRatingBadge rating={rating} productSlug={fabric.id} productName={fabric.name} />
                {customerPick && <QuickAddButton productId={fabric.productId} product={fabric} hasRating={rating !== null} />}
            </div>

            <div className="mt-3 flex flex-col">
                <button
                    onClick={() => customerPick ? navigate(`/fabrics/${fabric.id}`) : onSelectFabric?.(fabric)}
                    className="w-full overflow-hidden text-left font-display text-base font-medium leading-tight tracking-tight text-foreground transition-colors duration-300 hover:text-accent whitespace-nowrap text-ellipsis"
                    title={fabric.name}
                >
                    {fabric.name}
                </button>
                {customerPick && <ProductVariant fabric={fabric} />}
                {fabric.price && <ProductPrice price={fabric.price} customerPick={customerPick} />}
                
                    {!customerPick && <span className="mt-2 text-xs text-foreground/55">Availability confirmed at checkout</span>}
                    {!customerPick && <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link to={`/fabrics/${fabric.id}`} className="text-sm font-medium text-foreground underline decoration-accent underline-offset-4">View details</Link>
                    <AddToCartButton productId={fabric.productId} product={fabric} compact />
                </div>}
            </div>
        </article>
    );
}

function useProductRating(productId) {
    const [rating, setRating] = useState(null);

    React.useEffect(() => {
        let active = true;
        listProductReviews(productId).then((reviews) => {
            if (!active || !reviews.length) return;
            const average = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
            setRating(average);
        }).catch(() => {
            if (active) setRating(null);
        });
        return () => { active = false; };
    }, [productId]);

    return rating;
}

function ReviewRatingBadge({ rating, productSlug, productName }) {

    if (rating === null) return null;

    return <Link
        to={`/fabrics/${productSlug}#reviews`}
        onClick={(event) => event.stopPropagation()}
        aria-label={`View reviews for ${productName}, average rating ${rating.toFixed(1)} out of 5`}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-xl border border-white/70 bg-white px-2.5 py-1.5 shadow-md transition-transform duration-200 hover:scale-105"
    >
        <span className="text-xs font-semibold text-gray-900">{rating.toFixed(1)}</span>
        <Star className="h-3.5 w-3.5 fill-current text-accent" aria-hidden="true" />
    </Link>;
}

function ProductVariant({ fabric }) {
    const details = [fabric.color, fabric.fabricType, fabric.tone].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(" · ");
    if (!details) return null;
    return <p className="mt-1 truncate text-xs text-foreground/55">{details}</p>;
}

function ProductPrice({ price, customerPick }) {
    const [amount, unit] = String(price).split("/");
    return <p className={`mt-2 font-sans ${customerPick ? "text-sm font-bold text-foreground" : "text-sm font-medium tracking-wide text-accent"}`}>
        {amount}{unit && <span className="font-normal text-foreground/55"> / {unit}</span>}
    </p>;
}

function QuickAddButton({ productId, product, hasRating }) {
    const { addItem } = useCart();
    const [state, setState] = useState("idle");

    const handleClick = async (event) => {
        event.stopPropagation();
        if (state === "loading") return;
        setState("loading");
        try {
            await addItem(productId, 1, product);
            setState("success");
            window.setTimeout(() => setState("idle"), 1400);
        } catch {
            setState("idle");
        }
    };

    return <button
        type="button"
        onClick={handleClick}
        aria-label={`Add ${product.name} to cart`}
        disabled={state === "loading"}
        className={`absolute right-3 z-30 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border/60 bg-white px-3 text-xs font-semibold text-foreground shadow-md transition-transform duration-200 hover:scale-105 disabled:cursor-wait disabled:opacity-80 ${hasRating ? "bottom-14" : "bottom-3"}`}
    >
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "success" ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
        <span>{state === "success" ? "Added" : "Add"}</span>
    </button>;
}

