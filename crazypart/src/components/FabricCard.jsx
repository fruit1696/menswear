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
export default function FabricCard({ fabric, onSelectFabric }) {
    const images = fabricImages(fabric);

    return (
        <article className="group flex flex-col">
            <div
                className="swatch-shadow rounded-sm overflow-hidden cursor-pointer"
                onClick={() => onSelectFabric?.(fabric)}
            >
                <FabricCarousel
                    images={images}
                    altBase={`${fabric.name} — Raymond shirt fabric, 2-piece cut`}
                    badge="2-PIECE SHIRT"
                />
            </div>

            <div className="mt-4 flex flex-col">
                <button
                    onClick={() => onSelectFabric?.(fabric)}
                    className="text-left font-display text-base sm:text-lg font-medium text-foreground hover:text-accent transition-colors duration-300 tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-full"
                    title={fabric.name}
                >
                    {fabric.name}
                </button>
                {fabric.price && (
                    <span className="mt-1.5 text-sm sm:text-[15px] font-medium tracking-wide text-accent font-sans">
                        {fabric.price}
                    </span>
                )}
            </div>
        </article>
    );
}