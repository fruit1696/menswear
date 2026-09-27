import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import FabricCard from "@/components/FabricCard";
import FabricCarousel from "@/components/FabricCarousel";
import SectionHeading from "@/components/SectionHeading";
import PickYourStyle from "@/components/sections/PickYourStyle";
import { FEATURED_COLLECTIONS, FULL_COLLECTION } from "@/lib/featuredCollections";
import { fabricImages } from "@/lib/brand";
import AddToCartButton from "@/features/cart/AddToCartButton";

export default function FeaturedCollection() {
    const { collectionId, productId } = useParams();
    const collection = collectionId === "all" ? FULL_COLLECTION : FEATURED_COLLECTIONS[collectionId];
    const selectedFabric = productId ? collection?.varieties.find((fabric) => fabric.id === productId) : null;

    React.useEffect(() => {
        if (selectedFabric) document.title = `${selectedFabric.name} | Crazy Cutpiece`;
        else if (collection) document.title = `${collection.name} | Crazy Cutpiece`;
    }, [collection, selectedFabric]);

    if (!collection) {
        return <main className="min-h-[70vh] px-5 pb-20 pt-36 text-center sm:px-8">
            <h1 className="font-display text-4xl text-foreground">Collection not found</h1>
            <Link to="/#fabrics" className="mt-6 inline-block border-b border-accent pb-1 text-sm font-medium">Back to Top Picks</Link>
        </main>;
    }

    if (productId && !selectedFabric) {
        return <main className="min-h-[70vh] px-5 pb-20 pt-36 text-center sm:px-8">
            <h1 className="font-display text-4xl text-foreground">Product not found</h1>
            <Link to={`/collections/${collectionId}`} className="mt-6 inline-block border-b border-accent pb-1 text-sm font-medium">Back to {collection.name}</Link>
        </main>;
    }

    if (selectedFabric) return <CollectionProductDetail fabric={selectedFabric} collection={collection} collectionId={collectionId} />;

    return <>
        <main className="min-h-screen bg-[#F9F8F6] px-5 pb-20 pt-32 sm:px-8 sm:pt-36">
            <div className="mx-auto max-w-7xl">
                <Link to="/#fabrics" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/65 transition-colors hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />Back to Top Picks
                </Link>
                <div className="mt-10 text-center">
                    <SectionHeading eyebrow="CURATED FABRICS" title={collection.name.toUpperCase()} align="center" />
                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-foreground/65 sm:text-base">{collection.description}</p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    {collection.varieties.map((fabric) => <FabricCard
                        key={fabric.id}
                        fabric={fabric}
                        customerPick
                        detailHref={`/collections/${collectionId}/${fabric.id}`}
                    />)}
                </div>
            </div>
        </main>
        {collection.id === "all" && <PickYourStyle />}
    </>;
}

function CollectionProductDetail({ fabric, collection, collectionId }) {
    const relatedProducts = collection.varieties.filter((item) => item.id !== fabric.id).slice(0, 4);

    return <main className="min-h-screen bg-[#F9F8F6] px-5 pb-20 pt-32 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-7xl">
            <Link to={`/collections/${collectionId}`} className="inline-flex items-center gap-2 text-sm font-medium text-foreground/65 transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />Back to {collection.name}
            </Link>
            <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="overflow-hidden rounded-xl bg-secondary shadow-lg lg:col-span-7">
                    <FabricCarousel
                        images={fabricImages(fabric)}
                        altBase={`${fabric.name} — Raymond shirt fabric`}
                        aspectClassName="aspect-[3/4]"
                    />
                </div>
                <div className="lg:sticky lg:top-28 lg:col-span-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">{collection.name}</p>
                    <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">{fabric.name}</h1>
                    <div className="brass-rule mt-6 w-20" />
                    <p className="mt-6 text-lg font-semibold text-foreground">{String(fabric.price).replace("/", "/ ")}</p>
                    <p className="mt-5 text-sm leading-relaxed text-foreground/65">Swipe on mobile or use the image arrows to explore all available photos of this fabric.</p>
                    <AddToCartButton productId={fabric.productId} product={fabric} />
                </div>
            </div>
            {relatedProducts.length > 0 && <section className="mt-20 border-t border-border/60 pt-12 sm:mt-24 sm:pt-16" aria-labelledby="related-products-heading">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">You may also like</p>
                        <h2 id="related-products-heading" className="mt-3 font-display text-3xl font-medium text-foreground sm:text-4xl">Related Products</h2>
                    </div>
                </div>
                <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:gap-4">
                    {relatedProducts.map((related) => <div key={related.id} className="w-[72vw] max-w-[280px] flex-none snap-start sm:w-[280px]">
                        <FabricCard
                            fabric={related}
                            customerPick
                            detailHref={`/collections/${collectionId}/${related.id}`}
                        />
                    </div>)}
                </div>
            </section>}
        </div>
    </main>;
}
