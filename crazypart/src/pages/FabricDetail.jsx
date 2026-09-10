import React from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Loader2, Star } from "lucide-react";
import Image from "@/components/ui/image";
import { WhatsAppIcon } from "@/components/Navbar";
import { FABRICS, whatsappLink } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";
import { useActiveProduct } from "@/features/products/productQueries";
import { productToFabric } from "@/features/products/productService";
import { createReview, getReviewContext, listProductReviews, updateReview } from "@/features/reviews/reviewService";
import { useAuth } from "@/lib/AuthContext";
import AddToCartButton from "@/features/cart/AddToCartButton";
import WishlistButton from "@/features/wishlist/WishlistButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function FabricDetail() {
    const { id } = useParams();
    const { data: product } = useActiveProduct(id);
    const fabric = product ? productToFabric(product) : FABRICS.find((f) => f.id === id);
    const [largeImage, setLargeImage] = React.useState(null);
    const [showAllSpecifications, setShowAllSpecifications] = React.useState(false);

    React.useEffect(() => {
        if (!fabric) return;
        document.title = `${fabric.name} — Raymond Shirt Fabric | Crazy Cutpiece`;

        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (canonicalLink) {
            canonicalLink.setAttribute("href", `https://menswear-cbbg.vercel.app/fabrics/${fabric.id}`);
        }
    }, [fabric]);

    if (!fabric) {
        return (
            <div className="pt-32 pb-24 text-center">
                <div className="mx-auto max-w-md px-5">
                    <h1 className="font-display text-4xl font-medium text-foreground">Fabric not found</h1>
                    <p className="mt-4 text-foreground/65">
                        This fabric may no longer be displayed online. Our collection changes
                        often — WhatsApp us to see what's currently available.
                    </p>
                    <Link
                        to="/fabrics"
                        className="mt-8 inline-block text-sm font-medium text-foreground border-b border-accent pb-1"
                    >
                        ← Back to Selected Fabrics
                    </Link>
                </div>
            </div>
        );
    }

    const numericPrice = fabric.price ? fabric.price.replace(/[^0-9]/g, "") : "460";
    const specifications = [
        ["Product", fabric.name],
        ["SKU", fabric.code],
        ["Category", fabric.category],
        ["Fabric", fabric.fabricType],
        ["Color", fabric.color],
        ["Pattern", fabric.pattern],
        ["Price", fabric.price],
    ].filter(([, value]) => value);

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": fabric.name,
        "image": fabric.image ? `https://menswear-cbbg.vercel.app${fabric.image}` : undefined,
        "description": fabric.description || `${fabric.name} - Raymond shirt fabric pre-cut set for men's shirts from Crazy Cutpiece.`,
        "brand": {
            "@type": "Brand",
            "name": "Raymond"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://menswear-cbbg.vercel.app/fabrics/${fabric.id}`,
            "priceCurrency": "INR",
            "price": numericPrice,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Crazy Cutpiece"
            }
        }
    };

    return (
        <div className="pt-24 sm:pt-28">
            {/* Product JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            {/* Breadcrumb */}
            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6">
                <Link to="/fabrics" className="text-sm text-foreground/55 hover:text-foreground transition-colors">
                    ← Selected Fabrics
                </Link>
            </div>

            <section className="pb-20 sm:pb-28">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="grid gap-10 lg:gap-16 lg:grid-cols-12 items-start">
                        {/* Image */}
                        <div className="lg:col-span-7">
                            <div className="relative swatch-shadow rounded-sm overflow-hidden bg-secondary">
                                <WishlistButton productId={fabric.productId} productName={fabric.name} />
                                <Image
                                    src={fabric.image}
                                    alt={`${fabric.name} — Raymond shirt fabric, 2-piece cutpiece`}
                                    fittingType="fill"
                                    className="w-full aspect-[4/5] cursor-zoom-in object-cover"
                                    onClick={() => setLargeImage(fabric.image)}
                                />
                                
                           
                            </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-5 lg:sticky lg:top-28">
                            <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                                {fabric.code} · {fabric.tone}
                            </span>
                            <h1 className="mt-4 font-display text-5xl sm:text-6xl font-medium leading-[1.02] tracking-tight text-foreground">
                                {fabric.name}
                            </h1>
                            <div className="brass-rule w-20 mt-6" />
                            <p className="mt-6 text-lg text-foreground/75 leading-relaxed">
                                {fabric.description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-y border-border/60 py-6">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">Format</p>
                                    <p className="mt-1 font-display text-xl text-foreground">2-Piece Set</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">Makes</p>
                                    <p className="mt-1 font-display text-xl text-foreground">1 Shirt</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">Size</p>
                                    <p className="mt-1 font-display text-xl text-foreground">≈1.7m × 57"</p>
                                </div>
                            </div>

                           
                            <AddToCartButton productId={fabric.productId} product={fabric} />

                            {specifications.length > 0 && <div className="mt-8 rounded-sm border border-border/60 bg-card p-5 sm:p-6">
                                <h2 className="font-display text-2xl font-medium text-foreground">Product Information</h2>
                                <div className={`mt-4 overflow-hidden transition-[max-height] duration-500 ease-in-out ${showAllSpecifications ? "max-h-[1000px]" : "max-h-[22rem]"}`}>
                                    <dl className="divide-y divide-border/60">
                                        {specifications.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-3 text-sm first:pt-0 last:pb-0"><dt className="text-foreground/55">{label}</dt><dd className="text-right font-medium text-foreground break-words">{value}</dd></div>)}
                                    </dl>
                                </div>
                                {specifications.length > 6 && <button type="button" onClick={() => setShowAllSpecifications((current) => !current)} aria-expanded={showAllSpecifications} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-accent underline-offset-4"><span>{showAllSpecifications ? "Show Less" : "Read More"}</span><ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAllSpecifications ? "rotate-180" : ""}`} /></button>}
                            </div>}
                            

                            
                        </div>
                    </div>
                </div>
            </section>

            <ProductReviews productId={fabric.productId} productName={fabric.name} />

            <Dialog open={Boolean(largeImage)} onOpenChange={(open) => !open && setLargeImage(null)}>
                <DialogContent className="max-w-4xl border-none bg-background p-2">
                    {largeImage && <Image src={largeImage} alt={`${fabric.name} enlarged`} fittingType="fill" className="max-h-[80vh] w-full object-contain" />}
                </DialogContent>
            </Dialog>

            {/* More on WhatsApp */}
            <section className="py-16 sm:py-20 bg-secondary/50 border-t border-border/60">
                <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
                    <h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground">
                        More Fabrics like this are available.
                    </h2>
                    <a
                        href={whatsappLink(`Hi Crazy Cutpiece, I'm interested in the ${fabric.name} (${fabric.code}) fabric. Can you show me similar available designs?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick(`product_detail_similar_${fabric.id}`)}
                        className="mt-7 inline-flex items-center gap-2.5 px-7 py-4 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm hover:bg-foreground/90 transition-colors duration-300"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        See More Fabrics on WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
}

function ProductReviews({ productId, productName }) {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = React.useState([]);
    const [eligibleOrders, setEligibleOrders] = React.useState([]);
    const [existingReview, setExistingReview] = React.useState(null);
    const [form, setForm] = React.useState({ rating: 0, review_text: "" });
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");

    const loadReviews = React.useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const nextReviews = await listProductReviews(productId);
            setReviews(nextReviews);
            if (user) {
                const context = await getReviewContext(user.id, productId);
                setEligibleOrders(context.eligibleOrders);
                setExistingReview(context.existingReview);
                if (context.existingReview) setForm({ rating: context.existingReview.rating, review_text: context.existingReview.review_text });
            } else {
                setEligibleOrders([]);
                setExistingReview(null);
            }
        } catch (loadError) {
            setError(loadError.message || "Unable to load reviews.");
        } finally {
            setLoading(false);
        }
    }, [productId, user]);

    React.useEffect(() => { loadReviews(); }, [loadReviews]);

    const submitReview = async (event) => {
        event.preventDefault();
        if (!user || !form.rating || form.review_text.trim().length < 10) return;
        setSaving(true);
        setError("");
        setMessage("");
        try {
            const saved = existingReview
                ? await updateReview(existingReview.id, user.id, { rating: form.rating, review_text: form.review_text.trim() })
                : await createReview({ product_id: productId, user_id: user.id, order_id: eligibleOrders[0].id, rating: form.rating, review_text: form.review_text.trim() });
            setExistingReview(saved);
            setReviews((current) => existingReview ? current.map((review) => review.id === saved.id ? saved : review) : [saved, ...current]);
            setMessage(existingReview ? "Your review was updated." : "Thanks for sharing your experience.");
        } catch (saveError) {
            setError(saveError.message || "Unable to save your review.");
        } finally {
            setSaving(false);
        }
    };

    const averageRating = reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0;
    const canReview = isAuthenticated && (eligibleOrders.length > 0 || existingReview);

    return <section id="reviews" className="scroll-mt-28 border-t border-border/60 bg-secondary/30 py-16 sm:py-20"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="mx-auto max-w-3xl"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[11px] uppercase tracking-[0.3em] text-accent">Customer feedback</p><h2 className="mt-3 font-display text-3xl font-medium text-foreground">Reviews for {productName}</h2></div><div className="flex items-center gap-2"><StarRating rating={averageRating} /><span className="text-sm text-foreground/60">{averageRating ? averageRating.toFixed(1) : "No"} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span></div></div>{loading && <p className="mt-8 text-sm text-foreground/60">Loading reviews...</p>}{error && <p role="alert" className="mt-8 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{!loading && !error && !reviews.length && <p className="mt-8 text-sm text-foreground/60">Be the first customer to share your experience with this fabric.</p>}{reviews.length > 0 && <div className="mt-8 divide-y divide-border/60 border-y border-border/60">{reviews.map((review) => <article key={review.id} className="py-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><StarRating rating={review.rating} /><span className="text-sm font-medium text-foreground">{review.author_name}</span></div><time className="text-xs text-foreground/50" dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString()}</time></div><p className="mt-3 text-sm leading-relaxed text-foreground/70">{review.review_text}</p></article>)}</div>}{isAuthenticated && canReview && <form onSubmit={submitReview} className="mt-10 border border-border/60 bg-card p-5 sm:p-6"><h3 className="font-display text-2xl text-foreground">{existingReview ? "Update your review" : "Review this product"}</h3><p className="mt-2 text-sm text-foreground/60">Verified customers can share their experience.</p><div className="mt-5"><p className="text-sm font-medium text-foreground">Your rating</p><div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" onClick={() => setForm({ ...form, rating })} aria-label={`${rating} star${rating === 1 ? "" : "s"}`} className="p-1 text-accent transition-transform hover:scale-110"><Star className={`h-6 w-6 ${rating <= form.rating ? "fill-current" : ""}`} /></button>)}</div></div><label className="mt-5 block space-y-2"><span className="text-sm font-medium text-foreground">Your review</span><textarea required minLength={10} maxLength={2000} value={form.review_text} onChange={(event) => setForm({ ...form, review_text: event.target.value })} className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground/60" placeholder="What did you think about this fabric?" /></label><Button type="submit" className="mt-5" disabled={saving || !form.rating || form.review_text.trim().length < 10}>{saving ? <Loader2 className="animate-spin" /> : <Star />}{existingReview ? "Update review" : "Submit review"}</Button>{message && <p role="status" className="mt-3 text-sm text-foreground/65">{message}</p>}</form>}{isAuthenticated && !canReview && <p className="mt-8 text-sm text-foreground/60">Reviews become available after you have purchased this product.</p>}{!isAuthenticated && <p className="mt-8 text-sm text-foreground/60">Sign in after purchasing this product to share a verified review.</p>}</div></div></section>;
}

function StarRating({ rating }) {
    return <span className="inline-flex text-accent" aria-label={`${rating.toFixed ? rating.toFixed(1) : rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= rating ? "fill-current" : ""}`} />)}</span>;
}