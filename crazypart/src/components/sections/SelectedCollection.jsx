import React, { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import FabricCard from "@/components/FabricCard";
import FabricCarousel from "@/components/FabricCarousel";
import { FABRICS, whatsappLink, fabricImages } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";
import { trackWhatsAppClick } from "@/lib/gtag";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function SelectedCollection() {
    const [selectedFabric, setSelectedFabric] = useState(null);

    const getWhatsappMessage = (fabric) => {
        if (!fabric) return "";
        return `Hi, I saw ${fabric.name} on Crazy Cut Piece. Can you show me the available colours and patterns in live stock?`;
    };

    return (
        <section id="fabrics" className="py-14 sm:py-20 bg-gradient-to-b from-white via-secondary/35 to-secondary/50">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex flex-col items-center text-center gap-4">
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-foreground text-balance">
                        TOP PICKS
                    </h2>
                    <div className="brass-rule w-24 mx-auto" />
                </div>

                <div className="mt-14 grid gap-x-6 gap-y-10 grid-cols-2 lg:grid-cols-4">
                    {FABRICS.map((f, i) => (
                        <FabricCard
                            key={f.id}
                            fabric={f}
                            index={i}
                            onSelectFabric={(fabric) => setSelectedFabric(fabric)}
                        />
                    ))}
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