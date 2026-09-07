import React from "react";
import Image from "@/components/ui/image";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";
import { ArrowRight, MessageCircle, Truck, Tag, BadgeCheck, Eye, ShieldCheck, RotateCcw } from "lucide-react";
import TranslateText from "@/components/TranslateText";

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
    const cardBoxClass = "mt-8 p-6 sm:p-10 rounded-sm bg-card border border-border/80 text-center max-w-4xl mx-auto swatch-shadow";

    return (
        <section id="why-crazy-cut-piece" className="py-14 sm:py-20 bg-gradient-to-b from-secondary/50 via-background to-background overflow-hidden">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">

                {/* 1. SECTION HEADER */}
                <div className="text-center max-w-3xl mx-auto">
                    <SectionHeading
                        eyebrow="WHY CHOOSE US"
                        title="Why Crazy Cut Piece?"
                        align="center"
                    />
                </div>

                {/* FEATURE CARD 1: PRICE TRANSPARENCY MOMENT */}
                <div className={cardBoxClass}>
                    <div className="flex flex-col items-center gap-2">
                        <Tag className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            RAYMOND AT AFFORDABLE PRICES
                        </span>
                    </div>
                    <div className="mt-3 font-display text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
                        ₹400 – ₹800
                    </div>
                    <p className="mt-2 text-base sm:text-lg font-medium text-foreground/80">
                        2-piece Raymond shirting sets
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/60 max-w-md mx-auto">
                        <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wider">
                            Choose from thousands of Raymond shirting options
                        </p>
                    </div>
                </div>

                {/* FEATURE CARD 2: AFFORDABLE PRICES EXPLANATION */}
                <div className={cardBoxClass}>
                    <div className="flex flex-col items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            RAYMOND AT SUCH AFFORDABLE PRICES? HERE'S WHY
                        </span>
                    </div>
                    <h3 className="mt-3 font-display text-3xl sm:text-5xl font-semibold text-foreground tracking-tight">
                        Premium Quality. Unbeatable Prices.
                    </h3>
                    <TranslateText
                        english="This fabric is Raymond quality, same mills, same process, but sold as 2-piece cuts, enough for one shirt. And importantly: not factory reject, but properly inspected pieces."
                        hindi="यह कपड़ा रेमंड क्वालिटी का ही है, वही मिल, वही प्रक्रिया, लेकिन 2-पीस कट में बेचा जाता है, जो एक शर्ट के लिए पर्याप्त है। और महत्वपूर्ण बात: यह कोई फैक्टरी रिजेक्ट नहीं है, बल्कि सही ढंग से जाँचा गया कपड़ा है।"
                        className="mt-4 text-base sm:text-lg text-foreground/75 leading-relaxed text-center block max-w-2xl mx-auto"
                    />
                </div>

                {/* FEATURE CARD 3: 100% TRANSPARENT SHOPPING */}
                <div className={cardBoxClass}>
                    <div className="flex flex-col items-center gap-2">
                        <Eye className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            100% TRANSPARENT SHOPPING
                        </span>
                    </div>
                    <h3 className="mt-3 font-display text-3xl sm:text-5xl font-semibold text-foreground tracking-tight">
                        What You See Is What You Get
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 pt-6 text-center max-w-2xl mx-auto">
                        <div className="p-5 bg-secondary/50 border border-border/60 rounded-sm">
                            <h5 className="font-display font-semibold text-foreground text-lg sm:text-xl mb-2">
                                Exact Live Visuals
                            </h5>
                            <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                                We send real photos of the exact fabric batch before you pay.
                            </p>
                        </div>
                        <div className="p-5 bg-secondary/50 border border-border/60 rounded-sm">
                            <h5 className="font-display font-semibold text-foreground text-lg sm:text-xl mb-2">
                                Real Availability
                            </h5>
                            <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                                What you see is what’s actually in stock today.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FEATURE CARD 4: AUTHENTIC MILL STOCK */}
                <div className={cardBoxClass}>
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            100% AUTHENTIC MILL STOCK
                        </span>
                    </div>
                    <h3 className="mt-3 font-display text-3xl sm:text-5xl font-semibold text-foreground tracking-tight">
                        ₹2,000 Quality for ₹400? Is it Real?
                    </h3>
                    <TranslateText
                        english={
                            <>
                                <p className="mt-4 text-base sm:text-lg text-foreground/75 leading-relaxed max-w-2xl mx-auto">
                                    In regular shops, fabric prices are higher because of showroom expenses, distributors, and multiple layers of middlemen. We source genuine Raymond fabric cut pieces directly from mill/factory stock, so you get premium quality at a much lower price.
                                </p>
                                <div className="mt-6 p-4 bg-secondary/50 border border-border/60 rounded-sm text-center max-w-md mx-auto">
                                    <RotateCcw className="w-4 h-4 text-accent mx-auto mb-2" strokeWidth={1.8} />
                                    <p className="text-xs sm:text-sm text-accent font-semibold uppercase tracking-wider">
                                        Don't like it? Return it and get your money back.
                                    </p>
                                </div>
                            </>
                        }
                        hindi={
                            <>
                                <p className="mt-4 text-base sm:text-lg text-foreground/75 leading-relaxed max-w-2xl mx-auto">
                                    पारंपरिक खुदरा कीमतों में महंगे शोरूम के खर्चे और कई परतों के बिचौलियों का मार्जिन शामिल होता है। हम सीधे मिल से फैक्टरी सरप्लस और कट पीस लाते हैं ताकि आपको सीधे फैक्टरी मूल्य पर असली रेमंड शर्टिंग मिल सके।
                                </p>
                                <div className="mt-6 p-4 bg-secondary/50 border border-border/60 rounded-sm text-center max-w-md mx-auto">
                                    <RotateCcw className="w-4 h-4 text-accent mx-auto mb-2" strokeWidth={1.8} />
                                    <p className="text-xs sm:text-sm text-accent font-semibold uppercase tracking-wider">
                                        ईमानदारी सबसे अच्छी नीति है।
                                    </p>
                                </div>
                            </>
                        }
                        className="w-full text-center"
                    />
                </div>

                {/* FEATURE CARD 5: SHIPPING & DELIVERY */}
                <div className={cardBoxClass}>
                    <div className="flex flex-col items-center gap-2">
                        <Truck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            SHIPPING &amp; DELIVERY
                        </span>
                    </div>
                    <h3 className="mt-3 font-display text-3xl sm:text-5xl font-semibold text-foreground tracking-tight">
                        Fast &amp; Reliable Shipping
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 pt-6 text-center max-w-2xl mx-auto">
                        <div className="p-5 bg-secondary/50 border border-border/60 rounded-sm">
                            <h5 className="font-display font-semibold text-foreground text-lg sm:text-xl mb-2">
                                Free Delivery
                            </h5>
                            <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                                Free delivery across Madhya Pradesh &amp; Maharashtra.
                            </p>
                        </div>
                        <div className="p-5 bg-secondary/50 border border-border/60 rounded-sm">
                            <h5 className="font-display font-semibold text-foreground text-lg sm:text-xl mb-2">
                                Other Locations
                            </h5>
                            <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                                Orders welcome from all locations. Applicable shipping charges will apply.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}