import React from "react";
import { Link } from "react-router-dom";
import FabricCarousel from "@/components/FabricCarousel";
import { WhatsAppIcon } from "@/components/Navbar";
import { fabricWhatsappLink, fabricImages } from "@/lib/brand";

/**
 * Reusable fabric card. Pass a fabric object from src/lib/brand.js.
 * The image area is a multi-image carousel (touch/swipe + arrows + dots).
 * Existing info is preserved: name, code, tone, description, WhatsApp CTA.
 */
export default function FabricCard({ fabric }) {
    const images = fabricImages(fabric);

    return (
        <article className="group flex flex-col">
            <div className="swatch-shadow rounded-sm overflow-hidden">
                <FabricCarousel
                    images={images}
                    altBase={`${fabric.name} — Raymond shirt fabric, 2-piece cut piece`}
                    badge="2-Piece Cut Piece"
                />
            </div>

            <div className="mt-5 flex flex-col">
                <div className="flex items-baseline justify-between gap-4">
                    <Link
                        to={`/fabrics/${fabric.id}`}
                        className="font-display text-2xl font-medium text-foreground hover:text-accent transition-colors duration-300"
                    >
                        {fabric.name}
                    </Link>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-accent">
                        {fabric.code}
                    </span>
                </div>
                <span className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-foreground/45">
                    {fabric.tone}
                </span>
                <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                    {fabric.description}
                </p>
                <div className="mt-5 flex items-center gap-4">
                    <a
                        href={fabricWhatsappLink(fabric)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground border-b border-accent pb-1 hover:border-foreground transition-colors duration-300"
                    >
                        <WhatsAppIcon className="w-4 h-4 text-accent" />
                        Ask About This Fabric
                    </a>
                </div>
            </div>
        </article>
    );
}