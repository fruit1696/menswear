import React, { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";
import { Truck, Tag, BadgeCheck, ShieldCheck, Languages } from "lucide-react";

const TRUST_POINTS = [
    {
        num: "01",
        title: "RAYMOND FABRIC",
        detail: "Real fabric photography. Premium shirting sourced through the mill / surplus and cut-piece market.",
        image: IMAGES.quality,
    },
    {
        num: "02",
        title: "1.7 METRES · 2 PIECES",
        detail: "Total length is 1.7 metres, pre-cut into 2 pieces — enough for one shirt.",
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
    const [isCard2Hindi, setIsCard2Hindi] = useState(false);
    const [isCard4Hindi, setIsCard4Hindi] = useState(false);
    const cardBoxClass = "p-6 sm:p-10 rounded-sm bg-card border border-border/80 text-center flex flex-col justify-between swatch-shadow h-full";

    return (
        <section id="why-crazy-cut-piece" className="py-12 sm:py-16 bg-gradient-to-b from-secondary/50 via-background to-background overflow-hidden">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">

                {/* 1. SECTION HEADER */}
                <div className="text-center max-w-3xl mx-auto">
                    <SectionHeading
                        eyebrow="WHY CHOOSE US"
                        title="Why Crazy Cutpiece?"
                        align="center"
                    />
                </div>

                {/* FEATURE CARD 1: PRICE TRANSPARENCY MOMENT */}
                <div className="mt-8 p-6 sm:p-10 rounded-sm bg-card border border-border/80 text-center max-w-4xl mx-auto swatch-shadow">
                    <div className="flex flex-col items-center gap-2">
                        <Tag className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            RAYMOND AT AFFORDABLE PRICES
                        </span>
                    </div>
                    <div className="mt-3 font-display text-4xl sm:text-6xl font-semibold text-foreground tracking-tight">
                        ₹460
                    </div>
                    <p className="mt-2 font-body text-base sm:text-lg font-normal text-foreground/70 leading-relaxed">
                        2-piece Raymond shirting sets
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/60 max-w-md mx-auto">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            Choose from thousands of Raymond shirting options
                        </p>
                    </div>
                </div>

                {/* 2-COLUMN GRID ON DESKTOP FOR EXPLANATION CARDS */}
                <div className="mt-8 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    {/* FEATURE CARD 2: AFFORDABLE PRICES EXPLANATION */}
                    <div className={cardBoxClass}>
                        <div className="flex flex-col items-center gap-2">
                            <BadgeCheck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent text-center block">
                                {isCard2Hindi ? "रेमंड के कट पीस, वो भी इतने कम दाम में?" : "RAYMOND AT SUCH AFFORDABLE PRICES? HERE'S WHY"}
                            </span>
                        </div>
                        <h3 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
                            Premium Quality. Unbeatable Prices.
                        </h3>

                        <div className="mt-4 block text-center max-w-2xl mx-auto flex-1">
                            <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                                {isCard2Hindi
                                    ? "यह कपड़ा रेमंड क्वालिटी का ही है, वही मिल, वही प्रक्रिया से तैयार किया गया। हम इसे 2-पीस में बेचते है, जो एक पूरी शर्ट के लिए पर्याप्त है। और महत्वपूर्ण बात: यह कोई फैक्टरी रिजेक्ट नहीं है, बल्कि सही ढंग से जाँचा गया कपड़ा है।"
                                    : "This fabric is Raymond quality, same mills, same process, but sold as 2-piece cuts, enough for one shirt. And importantly: not factory reject, but properly inspected pieces."
                                }
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsCard2Hindi((prev) => !prev)}
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-80 transition-all duration-200 cursor-pointer focus:outline-none"
                                aria-label={isCard2Hindi ? "See English version" : "See Hindi translation"}
                            >
                                <Languages className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{isCard2Hindi ? "See English" : "See Translation (हिंदी)"}</span>
                            </button>
                        </div>
                    </div>

                    {/* FEATURE CARD 3: AUTHENTIC MILL STOCK */}
                    <div className={cardBoxClass}>
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent text-center block">
                                {isCard4Hindi ? "100% असली मिल का कपड़ा" : "100% AUTHENTIC MILL STOCK"}
                            </span>
                        </div>
                        <h3 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
                            {isCard4Hindi ? "₹1,500 वाली Quality ₹460 में? सच में?" : "₹1,500 Quality for ₹460? Is it Real?"}
                        </h3>

                        <div className="mt-4 block w-full text-center max-w-2xl mx-auto flex-1">
                            {isCard4Hindi ? (
                                <>
                                    <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                                        हाँ, क्योंकि हम Raymond fabric के cutpieces बेचते हैं। Mill में बचा हुआ fabric छोटे pieces में उपलब्ध होता है। हम इन्हीं cutpieces को लेते हैं, जो एक पूरी shirt बनाने के लिए पर्याप्त होते हैं। इसलिए आपको वही अच्छी quality का fabric बहुत कम दाम में मिल जाता है।<br></br>
                                        आम दुकानों में fabric के दाम में showroom का खर्च और बीच के कई खर्चे भी जुड़ जाते हैं। यहाँ आपको सिर्फ उतना ही fabric मिलता है जितना एक shirt के लिए चाहिए।<br></br>

                                    </p>

                                </>
                            ) : (
                                <>
                                    <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                                        In regular shops, fabric prices are higher because of showroom expenses, distributors, and multiple layers of middlemen. We source genuine Raymond fabric cutpieces directly from mill/factory stock, so you get premium quality at a much lower price.
                                    </p>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsCard4Hindi((prev) => !prev)}
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-80 transition-all duration-200 cursor-pointer focus:outline-none"
                                aria-label={isCard4Hindi ? "See English version" : "See Hindi translation"}
                            >
                                <Languages className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{isCard4Hindi ? "See English" : "See Translation (हिंदी)"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* FEATURE CARD 4: SHIPPING & DELIVERY (HORIZONTAL CARD MATCHING REFERENCE CARD) */}
                <div className="mt-8 p-6 sm:p-10 rounded-sm bg-card border border-border/80 text-center max-w-4xl mx-auto swatch-shadow">
                    <div className="flex flex-col items-center gap-2">
                        <Truck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            SHIPPING &amp; DELIVERY
                        </span>
                    </div>
                    <div className="mt-3 font-display text-4xl sm:text-6xl font-semibold text-foreground tracking-tight">
                        FREE
                    </div>
                    <p className="mt-2 font-body text-base sm:text-lg font-normal text-foreground/70 leading-relaxed">
                        Free &amp; fast shipping across India
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/60 max-w-md mx-auto">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            Delivered directly to your doorstep
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
