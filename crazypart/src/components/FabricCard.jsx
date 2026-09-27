import React, { useState } from "react";
import Image from "@/components/ui/image";
import { fabricImages } from "@/lib/brand";
import WishlistButton from "@/features/wishlist/WishlistButton";
import AddToCartButton from "@/features/cart/AddToCartButton";
import { Star } from "lucide-react";
import { listProductReviews } from "@/features/reviews/reviewService";
import { Link, useNavigate } from "react-router-dom";

/**
 * Reusable fabric card. Pass a fabric object from src/lib/brand.js.
 * The image area is a multi-image carousel (touch/swipe + arrows + dots).
 * Existing info is preserved: name, code, tone, description, WhatsApp CTA.
 */
export default function FabricCard({ fabric, onSelectFabric, customerPick = false, staticCard = false, detailHref }) {
    const images = fabricImages(fabric);
    const navigate = useNavigate();
    const rating = useProductRating(fabric.productId);

    const handleImageClick = (event) => {
        if (event?.target.closest("button, a")) return;
        if (staticCard) return;
        if (onSelectFabric) onSelectFabric(fabric);
        else navigate(detailHref ?? `/fabrics/${fabric.id}`);
    };

    return (
        <article className={`group flex flex-col ${customerPick ? "overflow-hidden rounded-xl bg-white" : ""}`}>
            <div
                        className={`relative overflow-hidden swatch-shadow ${staticCard ? "cursor-default" : "cursor-pointer"} ${customerPick ? "rounded-xl" : "rounded-sm"}`}
                onClick={handleImageClick}
                role={!staticCard ? "link" : undefined}
                tabIndex={!staticCard ? 0 : undefined}
                onKeyDown={!staticCard ? (event) => {
                    if (event.key === "Enter" || event.key === " ") handleImageClick(event);
                } : undefined}
            >
                {!customerPick && <WishlistButton productId={fabric.productId} productName={fabric.name} />}
                {images[0] && <Image
                    src={images[0]}
                    alt={`${fabric.name} — Raymond shirt fabric, 2-piece cut`}
                    className={`w-full object-cover ${customerPick ? "aspect-[3/4]" : "aspect-[4/5]"}`}
                />}
                {!customerPick && <div className="pointer-events-none absolute left-4 top-4 z-20">
                    <span className="inline-block rounded-sm bg-background/85 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">2-PIECE SHIRT</span>
                </div>}
                <ReviewRatingBadge rating={rating} productSlug={fabric.id} productName={fabric.name} />
            </div>

            <div className={customerPick ? "flex flex-col px-2.5 pb-3 pt-3 sm:px-3" : "mt-3 flex flex-col"}>
                {customerPick ? (
                    <CustomerPickDetails fabric={fabric} navigate={navigate} staticCard={staticCard} detailHref={detailHref} />
                ) : (
                    <button
                        onClick={() => onSelectFabric ? onSelectFabric(fabric) : navigate(detailHref ?? `/fabrics/${fabric.id}`)}
                        className="w-full overflow-hidden text-left font-display text-base font-medium leading-tight tracking-tight text-foreground transition-colors duration-300 hover:text-accent hover:underline decoration-accent underline-offset-4 whitespace-nowrap text-ellipsis"
                        title={fabric.name}
                    >
                        {fabric.name}
                    </button>
                )}
                {!customerPick && fabric.price && <ProductPrice price={fabric.price} />}
                
                    {!customerPick && <span className="mt-2 text-xs text-foreground/55">Availability confirmed at checkout</span>}
                    {!customerPick && <div className="mt-4 flex flex-wrap items-center gap-3">
                    <AddToCartButton productId={fabric.productId} product={fabric} compact />
                </div>}
            </div>
        </article>
    );
}

function CustomerPickDetails({ fabric, navigate, staticCard, detailHref }) {
    const title = String(fabric.name || "Shirt fabric").replace(/^Raymond\s*/i, "") || "Shirt fabric";
    const currentPrice = parsePrice(fabric.price);
    const sellingPriceLabel = formatSellingPrice(fabric.price);
    const originalPrice = parsePrice(fabric.originalPrice);
    const discount = originalPrice && currentPrice && originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : null;
    const deliveryEstimate = formatDeliveryEstimate(fabric.deliveryLeadDays);

    return <>
        <div className="flex items-center justify-between gap-2">
            {staticCard ? <span className="truncate text-left font-sans text-sm font-bold uppercase leading-tight text-black">RAYMOND</span> : <button
                type="button"
                onClick={() => navigate(detailHref ?? `/fabrics/${fabric.id}`)}
                className="truncate text-left font-sans text-sm font-bold uppercase leading-tight text-black hover:underline"
            >RAYMOND</button>}
            <WishlistButton productId={fabric.productId} productName={fabric.name} compact inline />
        </div>
        <p className="mt-1 truncate font-sans text-xs text-gray-500" title={title}>{title}</p>
        {currentPrice && <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 font-sans">
            {originalPrice && <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString("en-IN")}</span>}
            <span className="text-sm font-bold text-black">{sellingPriceLabel}</span>
            {discount && <span className="text-xs font-medium text-orange-500">({discount}% OFF)</span>}
        </div>}
        {fabric.offerText && <p className="mt-1.5 truncate font-sans text-xs font-medium text-green-700">{fabric.offerText}</p>}
        {deliveryEstimate && <p className="mt-1.5 truncate font-sans text-[11px] text-gray-500">Delivery by {deliveryEstimate}</p>}
    </>;
}

function parsePrice(price) {
    if (price === undefined || price === null || price === "") return null;
    const value = Number(String(price).replace(/[^0-9.]/g, ""));
    return Number.isFinite(value) ? value : null;
}

function formatSellingPrice(price) {
    const [amount, unit] = String(price).split("/");
    return unit ? `${amount}/ ${unit}` : amount;
}

function formatDeliveryEstimate(leadDays) {
    if (!Number.isInteger(leadDays) || leadDays < 0) return null;
    const date = new Date();
    date.setDate(date.getDate() + leadDays);
    return new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" }).format(date);
}

function useProductRating(productId) {
    const [rating, setRating] = useState(null);

    React.useEffect(() => {
        if (!productId) return undefined;
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

function ProductPrice({ price }) {
    const [amount, unit] = String(price).split("/");
    return <p className="mt-2 font-sans text-sm font-medium tracking-wide text-accent">
        {amount}{unit && <span className="font-normal text-foreground/55"> / {unit}</span>}
    </p>;
}
