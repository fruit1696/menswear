import React from "react";
import FabricCard from "@/components/FabricCard";
import { WhatsAppIcon } from "@/components/Navbar";
import { FABRICS, whatsappLink } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";
import TranslateText from "@/components/TranslateText";

export default function Fabrics() {
    React.useEffect(() => {
        document.title = "Selected Raymond Shirt Fabrics | Crazy Cut Piece";
        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (canonicalLink) {
            canonicalLink.setAttribute("href", "https://menswear-cbbg.vercel.app/fabrics");
        }
    }, []);

    return (
        <div className="pt-24 sm:pt-28">
            {/* Header */}
            <section className="py-16 sm:py-24 border-b border-border/60">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                        The Gallery
                    </span>
                    <TranslateText
                        english={
                            <>
                                <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02] tracking-tight text-foreground text-balance">
                                    Fabrics We Sell
                                </h1>
                                <div className="brass-rule w-24 mt-7" />
                                <p className="mt-7 text-lg text-foreground/75 leading-relaxed max-w-2xl">
                                    What you see here is just a small glimpse of our collection. With 5,000+ fabrics and varieties to choose from, we can’t showcase everything online. WhatsApp us to explore our full collection.
                                </p>
                            </>
                        }
                        hindi={
                            <>
                                <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02] tracking-tight text-foreground text-balance">
                                    कपड़े जो हम बेचते हैं
                                </h1>
                                <div className="brass-rule w-24 mt-7" />
                                <p className="mt-7 text-lg text-foreground/75 leading-relaxed max-w-2xl">
                                    जो आप यहाँ देख रहे हैं वह हमारे संग्रह की केवल एक छोटी सी झलक है। 5,000+ कपड़ों और किस्मों के साथ, हम सब कुछ ऑनलाइन नहीं दिखा सकते। हमारा पूरा संग्रह देखने के लिए हमें WhatsApp करें।
                                </p>
                            </>
                        }
                    />
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
                        These are only a few examples. We have 5000+ fabrics available —
                        tell us what you're looking for and we'll send live photos.
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