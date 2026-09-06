import React from "react";
import Image from "@/components/ui/image";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";
import { ArrowRight, MessageCircle } from "lucide-react";

const TRUST_POINTS = [
    {
        num: "01",
        title: "RAYMOND FABRIC",
        detail: "Real fabric photography. Premium shirting sourced through the mill / surplus and cut-piece market.",
        image: IMAGES.quality,
    },
    {
        num: "02",
        title: "1.8 METRES · 2 PIECES",
        detail: "Each set is 1.8 metres, pre-cut into 2 pieces — enough for one shirt.",
    },
    {
        num: "03",
        title: "REAL AVAILABILITY",
        detail: "The fabrics shown are actual fabrics. Availability changes, so message us on WhatsApp and we confirm what is currently available.",
    },
    {
        num: "04",
        title: "CLEAR PRICING",
        detail: "The displayed price is for the 2-piece cut-piece set. No confusing retail pricing structure.",
    },
    {
        num: "05",
        title: "DIRECT COMMUNICATION",
        detail: "Have a question about the fabric, shade, availability, or order? Talk directly to us on WhatsApp.",
    },
];

export default function WhyBuy() {
    const whatsappUrl = "https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20know%20what%20Raymond%20fabrics%20are%20currently%20available.";

    return (
        <section id="why-crazy-cut-piece" className="py-20 sm:py-32 bg-background border-y border-border/60 overflow-hidden">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">

                {/* 1. SECTION HEADER */}
                <div className="text-center max-w-3xl mx-auto">
                    <SectionHeading
                        eyebrow=""
                        title="Why Crazy Cut Piece?"
                        align="center"
                    />
                </div>

                {/* 4. PRICE TRANSPARENCY MOMENT */}
                <div className="mt-10 p-8 sm:p-12 rounded-sm bg-gradient-to-b from-secondary/80 to-background border border-border/80 text-center max-w-4xl mx-auto shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                        TRANSPARENT PRICING FACT
                    </span>
                    <div className="mt-3 font-display text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
                        ₹400 – ₹1,500
                    </div>
                    <p className="mt-2 text-base sm:text-lg font-medium text-foreground/80">
                        2-piece Raymond shirting sets
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/60 max-w-md mx-auto">
                        <p className="text-sm font-medium text-foreground/65 tracking-wide uppercase">
                            No hidden pricing. No confusing retail structure.
                        </p>
                    </div>
                </div>

                {/* 5. THE BIG TRUST MOMENT */}
                <div className="mt-10 py-10 px-6 sm:px-10 rounded-sm bg-accent/5 border border-accent/20 text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                        HONESTLY, WHY IS IT CHEAPER?
                    </p>
                    <h3 className="mt-4 font-display text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
                        Smart buying. Not compromise.
                    </h3>
                    <p className="mt-4 text-base sm:text-xl font-medium text-foreground/75">
                        Not inferior or defective fabric.
                    </p>
                </div>

                {/* 6. 100% TRANSPARENT SHOPPING */}
                <div className="mt-10 py-10 px-6 sm:px-10 rounded-sm bg-accent/5 border border-accent/20 text-center max-w-4xl mx-auto space-y-6">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                        100% TRANSPARENT SHOPPING
                    </p>
                    <div className="grid gap-6 sm:grid-cols-3 pt-2 text-center">
                        <div className="p-4 bg-background/80 border border-border/60 rounded-sm">
                            <h5 className="font-display font-semibold text-foreground text-base mb-1">
                                Exact Live Visuals
                            </h5>
                            <p className="text-xs text-foreground/75 leading-relaxed">
                                We send real photos of the exact fabric batch before you pay.
                            </p>
                        </div>
                        <div className="p-4 bg-background/80 border border-border/60 rounded-sm">
                            <h5 className="font-display font-semibold text-foreground text-base mb-1">
                                Real Availability
                            </h5>
                            <p className="text-xs text-foreground/75 leading-relaxed">
                                What you see is what’s actually in stock today.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center max-w-3xl mx-auto mt-10">
                    {/* Customer Hook Quote */}
                    <div className="p-6 sm:p-8 rounded-sm bg-secondary/70 border border-border/70 backdrop-blur-sm shadow-sm inline-block w-full">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                            ₹2,000 Raymond Quality for ₹400? Is it real? Yes—100% Authentic Mill Stock.
                        </p>
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-1.5">
                            <p className="text-base sm:text-lg font-medium text-foreground/90">
                                Traditional retail prices include expensive showroom overheads and multi-layer distributor margins. We source factory-surplus and cut pieces straight from the mill to bring you authentic Raymond shirting at direct factory value.
                            </p>
                            <p className="text-sm sm:text-base text-accent font-medium uppercase tracking-wider text-center">
                                Honesty is the best policy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shipping (Simple) */}
                <div className="mt-16 text-center pt-6 border-t border-border/50 max-w-2xl mx-auto">
                    <p className="text-xs uppercase tracking-widest text-foreground/50 font-semibold mb-1">
                        SHIPPING LOCATION
                    </p>
                    <p className="text-sm text-foreground/80 font-medium">
                        Shipping initially available across <span className="text-foreground font-semibold">Madhya Pradesh & Maharashtra</span>.
                    </p>
                </div>

                {/* 7. CTA */}
                <div className="mt-16 text-center pt-8 border-t border-border/60">
                    <p className="font-display text-xl sm:text-2xl font-medium text-foreground mb-6">
                        Want to know what’s currently available?
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-medium text-sm tracking-wider uppercase rounded-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        CHECK AVAILABILITY ON WHATSAPP
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

            </div>
        </section>
    );
}