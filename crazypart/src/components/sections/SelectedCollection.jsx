import React, { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import FabricCard from "@/components/FabricCard";
import FabricCarousel from "@/components/FabricCarousel";
import { FABRICS, whatsappLink, fabricImages } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";
import { trackWhatsAppClick } from "@/lib/gtag";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useActiveProducts } from "@/features/products/productQueries";
import { productToFabric } from "@/features/products/productService";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Image from "@/components/ui/image";
import { FEATURED_COLLECTION_LIST } from "@/lib/featuredCollections";

export default function SelectedCollection() {
    const [selectedFabric, setSelectedFabric] = useState(null);
    const { data: products } = useActiveProducts();
    const fabrics = products?.map(productToFabric) ?? FABRICS;

    const getWhatsappMessage = (fabric) => {
        if (!fabric) return "";
        return `Hi, I saw ${fabric.name} on Crazy Cutpiece. Can you show me the available colours and patterns in live stock?`;
    };

    return (
        <section id="fabrics" className="py-12 sm:py-16 bg-[#F9F8F6]">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex flex-col items-center text-center">
                    <SectionHeading
                        eyebrow="CUSTOMER FAVORITES"
                        title="TOP PICKS"
                        align="center"
                    />
                </div>

                <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    {fabrics.map((f, i) => (
                        <FabricCard
                            key={f.id}
                            fabric={f}
                            index={i}
                            customerPick
                            onSelectFabric={(fabric) => setSelectedFabric(fabric)}
                        />
                    ))}
                </div>

                <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:gap-6">
                    {FEATURED_COLLECTION_LIST.map((collection) => <section key={collection.id} aria-labelledby={`${collection.id}-collection-title`}>
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">Browse by color</p>
                                <h3 id={`${collection.id}-collection-title`} className="mt-1 font-display text-2xl font-medium text-foreground sm:text-3xl">{collection.name}</h3>
                            </div>
                            <span className="text-xs text-foreground/50">{collection.varieties.length} varieties</span>
                        </div>
                        <Link to={`/collections/${collection.id}`} className="group block max-w-sm overflow-hidden rounded-xl bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md" aria-label={`Browse ${collection.name}`}>
                            <div className="relative overflow-hidden rounded-xl">
                                <Image src={collection.image} alt={`${collection.name} preview`} className="aspect-[3/4] w-full object-cover object-[center_10%] transition-transform duration-500 group-hover:scale-[1.02]" />
                                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
                                    View Collection<ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </Link>
                    </section>)}
                </div>

                {/* Product Lightbox Modal */}
                <Dialog open={!!selectedFabric} onOpenChange={(open) => !open && setSelectedFabric(null)}>
                    <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden bg-background border-none shadow-2xl rounded-xl">
                        {selectedFabric && (
                            <div className="flex flex-col">
                                {/* Fabric Multi-Image Carousel */}
                                <div className="relative aspect-[4/5] w-full bg-secondary overflow-hidden">
                                    <FabricCarousel
                                        images={fabricImages(selectedFabric)}
                                        altBase={`${selectedFabric.name} — Raymond shirt fabric, 2-piece cut`}
                                        badge="2-Piece Cut"
                                    />
                                </div>

                                {/* Modal Content Details */}
                                <div className="p-6 flex flex-col gap-4 bg-background">
                                    <DialogHeader className="p-0 space-y-1 text-left">
                                        <div className="flex items-center justify-between gap-2">
                                            <DialogTitle className="font-display text-2xl font-bold text-foreground">
                                                {selectedFabric.name}
                                            </DialogTitle>
                                            <span className="text-sm font-semibold text-accent whitespace-nowrap">
                                                {selectedFabric.price || "₹400 – ₹1,500"}
                                            </span>
                                        </div>
                                        <DialogDescription className="text-xs uppercase tracking-wider text-foreground/60">
                                            {selectedFabric.tone} {selectedFabric.code ? `· ${selectedFabric.code}` : ''}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <p className="text-sm text-foreground/75 leading-relaxed">
                                        {selectedFabric.description}
                                    </p>

                                    {/* Prominent WhatsApp CTA */}
                                    <a
                                        href={whatsappLink(getWhatsappMessage(selectedFabric))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackWhatsAppClick(`lightbox_${selectedFabric.id}`)}
                                        className="mt-2 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#1E5E41] hover:bg-[#184C35] text-white text-sm font-medium tracking-wide rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full text-center"
                                    >
                                        <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
                                        <span>See Live Stock on WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </section>
    );
}
