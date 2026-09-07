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
    const whatsappUrl = "https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20know%20what%20Raymond%20fabrics%20are%20currently%20available.";

    return (
        <section id="why-crazy-cut-piece" className="py-14 sm:py-20 bg-gradient-to-b from-secondary/50 via-background to-background overflow-hidden">
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
                    <div className="flex flex-col items-center gap-2">
                        <Tag className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
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
                        <p className="text-sm font-medium text-foreground/65 tracking-wide uppercase">
                            Choose from thousands of Raymond shirting options
                        </p>
                    </div>
                </div>

                {/* 5. THE BIG TRUST MOMENT */}
                <div className="mt-10 py-10 px-6 sm:px-10 rounded-sm bg-accent/5 border border-accent/20 text-center max-w-4xl mx-auto">
                    <div className="flex flex-col items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                            Raymond at Such Affordable Prices? Here's Why
                        </p>
                    </div>
                    <h3 className="mt-4 font-display text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
                        Premium Quality. Unbeatable Prices.
                    </h3>
                    <TranslateText
                        english="This fabric is Raymond quality, same mills, same process, but sold as 2-piece cuts, enough for one shirt. And importantly: not factory reject, but properly inspected pieces."
                        hindi="यह कपड़ा रेमंड क्वालिटी का ही है, वही मिल, वही प्रक्रिया, लेकिन 2-पीस कट में बेचा जाता है, जो एक शर्ट के लिए पर्याप्त है। और महत्वपूर्ण बात: यह कोई फैक्टरी रिजेक्ट नहीं है, बल्कि सही ढंग से जाँचा गया कपड़ा है。"
                        className="mt-4 text-lg text-foreground/75 leading-relaxed text-center block"
                    />
                </div>

                {/* 6. 100% TRANSPARENT SHOPPING */}
                <div className="mt-10 py-10 px-6 sm:px-10 rounded-sm bg-accent/5 border border-accent/20 text-center max-w-4xl mx-auto space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <Eye className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                            100% TRANSPARENT SHOPPING
                        </p>
                    </div>
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
                        <TranslateText
                            english={
                                <>
                                    <div className="flex flex-col items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                                            ₹2,000 Raymond Quality for ₹400?
                                        </p>
                                    </div>
                                    <h3 className="mt-4 font-display text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
                                        Is it Real? <br></br> Yes -100% Authentic Mill Stock
                                    </h3>
                                    <div className="mt-4 pt-4 border-t border-border/50 space-y-1.5">
                                        <p className="text-lg text-foreground/75 leading-relaxed text-center block">
                                            In regular shops, fabric prices are higher because of showroom expenses, distributors, and multiple layers of middlemen.<br></br>
                                            <br></br>
                                            We source genuine Raymond fabric cut pieces directly from mill/factory stock, so you get premium quality at a much lower price.<br></br>
                                            <br></br>
                                            Same quality. Better price
                                            <br></br>
                                        </p>
                                        <div className="mt-4 p-4 bg-background/80 border border-border/60 rounded-sm text-center">
                                            <RotateCcw className="w-4 h-4 text-accent mx-auto mb-2" strokeWidth={1.8} />
                                            <p className="text-sm sm:text-base text-accent font-medium uppercase tracking-wider">
                                                Don't like it? Return it and get your money back.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            }
                            hindi={
                                <>
                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                                        ₹2,000 की रेमंड क्वालिटी ₹400 में? क्या यह सच है? हाँ—100% असली मिल स्टॉक।
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-border/50 space-y-1.5">
                                        <p className="text-lg text-foreground/75 leading-relaxed text-center block">
                                            पारंपरिक खुदरा कीमतों में महंगे शोरूम के खर्चे और कई परतों के बिचौलियों का मार्जिन शामिल होता है। हम सीधे मिल से फैक्टरी सरप्लस और कट पीस लाते हैं ताकि आपको सीधे फैक्टरी मूल्य पर असली रेमंड शर्टिंग मिल सके।
                                        </p>
                                        <div className="mt-4 p-4 bg-background/80 border border-border/60 rounded-sm text-center">
                                            <RotateCcw className="w-4 h-4 text-accent mx-auto mb-2" strokeWidth={1.8} />
                                            <p className="text-sm sm:text-base text-accent font-medium uppercase tracking-wider">
                                                ईमानदारी सबसे अच्छी नीति है।
                                            </p>
                                        </div>
                                    </div>
                                </>
                            }
                            className="w-full text-center"
                        />
                    </div>
                </div>

                {/* Shipping & Delivery */}
                <div className="mt-10 py-10 px-6 sm:px-10 rounded-sm bg-accent/5 border border-accent/20 text-center max-w-4xl mx-auto space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <Truck className="w-5 h-5 text-accent" strokeWidth={1.8} />
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                            SHIPPING &amp; DELIVERY
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 pt-2 text-center">
                        <div className="p-4 bg-background/80 border border-border/60 rounded-sm">
                            <h5 className="font-display font-semibold text-foreground text-base mb-1">
                                Free Delivery
                            </h5>
                            <p className="text-xs text-foreground/75 leading-relaxed">
                                Free delivery across Madhya Pradesh &amp; Maharashtra.
                            </p>
                        </div>
                        <div className="p-4 bg-background/80 border border-border/60 rounded-sm">
                            <h5 className="font-display font-semibold text-foreground text-base mb-1">
                                Other Locations
                            </h5>
                            <p className="text-xs text-foreground/75 leading-relaxed">
                                Orders welcome from all locations. Applicable shipping charges will apply.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 7. CTA
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
                */}

            </div>
        </section>
    );
}