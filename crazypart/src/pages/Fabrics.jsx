import React from "react";
import FabricCard from "@/components/FabricCard";
import { WhatsAppIcon } from "@/components/Navbar";
import { FABRICS, whatsappLink } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";

export default function Fabrics() {
    React.useEffect(() => {
        document.title = "Selected Raymond Shirt Fabrics | Crazy Cut Piece";
        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (canonicalLink) {
            canonicalLink.setAttribute("href", "https://menswear-cbbg.vercel.app/fabrics");
        }
    }, []);

    return (
        <div className="pt-16 sm:pt-20">
            {/* Header */}
            <section className="py-16 sm:py-24 border-b border-border/60">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                        The Gallery
                    </span>
                    <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02] tracking-tight text-foreground text-balance">
                        Selected Fabrics
                    </h1>
                    <div className="brass-rule w-24 mt-7" />
                    <p className="mt-7 text-lg text-foreground/75 leading-relaxed max-w-2xl">
                        A small selection from our collection. Our online gallery is only a
                        glimpse of the fabrics currently available — the full, current range
                        is yours to discover on WhatsApp.
                    </p>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {FABRICS.map((f, i) => (
                            <FabricCard key={f.id} fabric={f} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Want to see more */}
            <section className="py-20 sm:py-28 bg-foreground text-primary-foreground">
                <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                        Want to See More?
                    </span>
                    <h2 className="mt-5 font-display text-4xl sm:text-5xl font-medium leading-tight text-balance">
                        WhatsApp us to see current available designs.
                    </h2>
                    <p className="mt-6 text-primary-foreground/75 leading-relaxed">
                        These are only a few examples. We have many more fabrics available —
                        tell us what you're looking for and we'll send actual photos.
                    </p>
                    <a
                        href={whatsappLink("Hi Crazy Cut Piece, I'd like to see more shirt fabric designs.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick('fabrics_gallery_cta')}
                        className="mt-9 inline-flex items-center gap-2.5 px-7 py-4 bg-white/10 hover:bg-white/15 text-sm font-medium tracking-wide rounded-sm transition-colors duration-300"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        WhatsApp Us
                    </a>
                </div>
            </section>
        </div>
    );
}