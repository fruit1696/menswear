import React from "react";
import { useParams, Link } from "react-router-dom";
import Image from "@/components/ui/image";
import { WhatsAppIcon } from "@/components/Navbar";
import { FABRICS, fabricWhatsappLink, whatsappLink } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";

export default function FabricDetail() {
    const { id } = useParams();
    const fabric = FABRICS.find((f) => f.id === id);

    React.useEffect(() => {
        if (!fabric) return;
        document.title = `${fabric.name} — Raymond Shirt Fabric | Crazy Cut Piece`;

        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (canonicalLink) {
            canonicalLink.setAttribute("href", `https://menswear-cbbg.vercel.app/fabrics/${fabric.id}`);
        }
    }, [fabric]);

    if (!fabric) {
        return (
            <div className="pt-32 pb-24 text-center">
                <div className="mx-auto max-w-md px-5">
                    <h1 className="font-display text-4xl font-medium text-foreground">Fabric not found</h1>
                    <p className="mt-4 text-foreground/65">
                        This fabric may no longer be displayed online. Our collection changes
                        often — WhatsApp us to see what's currently available.
                    </p>
                    <Link
                        to="/fabrics"
                        className="mt-8 inline-block text-sm font-medium text-foreground border-b border-accent pb-1"
                    >
                        ← Back to Selected Fabrics
                    </Link>
                </div>
            </div>
        );
    }

    const numericPrice = fabric.price ? fabric.price.replace(/[^0-9]/g, "") : "460";

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": fabric.name,
        "image": fabric.image ? `https://menswear-cbbg.vercel.app${fabric.image}` : undefined,
        "description": fabric.description || `${fabric.name} - Raymond shirt fabric pre-cut set for men's shirts from Crazy Cut Piece.`,
        "brand": {
            "@type": "Brand",
            "name": "Raymond"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://menswear-cbbg.vercel.app/fabrics/${fabric.id}`,
            "priceCurrency": "INR",
            "price": numericPrice,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Crazy Cut Piece"
            }
        }
    };

    return (
        <div className="pt-24 sm:pt-28">
            {/* Product JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            {/* Breadcrumb */}
            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6">
                <Link to="/fabrics" className="text-sm text-foreground/55 hover:text-foreground transition-colors">
                    ← Selected Fabrics
                </Link>
            </div>

            <section className="pb-20 sm:pb-28">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="grid gap-10 lg:gap-16 lg:grid-cols-12 items-start">
                        {/* Image */}
                        <div className="lg:col-span-7">
                            <div className="swatch-shadow rounded-sm overflow-hidden bg-secondary">
                                <Image
                                    src={fabric.image}
                                    alt={`${fabric.name} — Raymond shirt fabric, 2-piece cut piece`}
                                    fittingType="fill"
                                    className="w-full aspect-[4/5] object-cover"
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-5 lg:sticky lg:top-28">
                            <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                                {fabric.code} · {fabric.tone}
                            </span>
                            <h1 className="mt-4 font-display text-5xl sm:text-6xl font-medium leading-[1.02] tracking-tight text-foreground">
                                {fabric.name}
                            </h1>
                            <div className="brass-rule w-20 mt-6" />
                            <p className="mt-6 text-lg text-foreground/75 leading-relaxed">
                                {fabric.description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-y border-border/60 py-6">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">Format</p>
                                    <p className="mt-1 font-display text-xl text-foreground">2-Piece Cut Piece</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">Yields</p>
                                    <p className="mt-1 font-display text-xl text-foreground">1 Shirt</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">Size</p>
                                    <p className="mt-1 font-display text-xl text-foreground">≈1.8m × 57"</p>
                                </div>
                            </div>

                            <a
                                href={fabricWhatsappLink(fabric)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackWhatsAppClick(`product_detail_${fabric.id}`)}
                                className="mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-7 py-4 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm hover:bg-foreground/90 transition-colors duration-300"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                                Check Availability of This Weave
                            </a>

                            <div className="mt-10 space-y-4 text-sm text-foreground/65 leading-relaxed">
                                <p>
                                    Want to see more fabrics like this? WhatsApp us and we'll show
                                    you what's currently available.
                                </p>
                                <p className="text-foreground/50">
                                    Online fabrics represent a selection of our collection. Actual
                                    availability may change. Contact us for current fabric options.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* More on WhatsApp */}
            <section className="py-16 sm:py-20 bg-secondary/50 border-t border-border/60">
                <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
                    <h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground">
                        More weaves like this are available.
                    </h2>
                    <a
                        href={whatsappLink(`Hi Crazy Cut Piece, I'm interested in the ${fabric.name} (${fabric.code}) fabric. Can you show me similar available designs?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick(`product_detail_similar_${fabric.id}`)}
                        className="mt-7 inline-flex items-center gap-2.5 px-7 py-4 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm hover:bg-foreground/90 transition-colors duration-300"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        See Similar Fabrics on WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
}