import React from "react";
import FabricCard from "@/components/FabricCard";
import { WhatsAppIcon } from "@/components/Navbar";
import { FABRICS, whatsappLink } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";
import TranslateText from "@/components/TranslateText";
import { useActiveProducts } from "@/features/products/productQueries";
import { productToFabric } from "@/features/products/productService";
import { FULL_COLLECTION } from "@/lib/featuredCollections";

export default function Fabrics() {
    const { data: products } = useActiveProducts();
    const fabrics = products?.length ? products.map(productToFabric) : FULL_COLLECTION.varieties;

    React.useEffect(() => {
        document.title = "Selected Raymond Shirt Fabrics | Crazy Cutpiece";
        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (canonicalLink) {
            canonicalLink.setAttribute("href", "https://menswear-cbbg.vercel.app/fabrics");
        }
    }, []);

    return (
        <div className="pt-24 sm:pt-28">
            {/* Header */}
            <section className="py-12 sm:py-16 border-b border-border/60">
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
                                    What you see here is just a small glimpse of our collection. With 5,000+ fabrics and varieties to choose from, we can’t showcase everything online. Looking for a different color or pattern? Let us know what you’re looking for, and if it’s available, we’ll notify you.
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
                                    यह हमारी पूरी कलेक्शन की सिर्फ़ एक छोटी-सी झलक है। हमारे पास 5,000+ फैब्रिक्स और कई तरह के रंग व पैटर्न उपलब्ध हैं, जिन्हें हम पूरी तरह ऑनलाइन नहीं दिखा सकते। आपको कोई दूसरा रंग या पैटर्न चाहिए? हमें बताइए कि आप क्या ढूंढ रहे हैं। अगर वह उपलब्ध हुआ, तो हम आपको सूचित करेंगे।

                                </p>
                            </>
                        }
                    />
                </div>
            </section>

            {/* Gallery */}
            <section className="py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        {fabrics.map((f) => (
                            <FabricCard key={f.id} fabric={f} customerPick detailHref={`/collections/all/${f.id}`} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Want to see more */}
            <section className="py-12 sm:py-16 bg-foreground text-primary-foreground">
                <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                        Explore Beyond Our Online Collection
                    </span>
                    <h2 className="mt-5 font-display text-4xl sm:text-5xl font-medium leading-tight text-balance">
                        Let us know what you’re looking for
                    </h2>
                    <p className="mt-6 text-primary-foreground/75 leading-relaxed">
                        These are only a few examples. We have 5000+ fabrics available
                        Looking for a different color or pattern? Let us know what you’re looking for, and if it’s available, we’ll notify you.
                    </p>
                </div>
            </section>
        </div>
    );
}