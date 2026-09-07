import React from "react";
import Image from "@/components/ui/image";
import { MapPin, Navigation, Clock, Phone, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function VisitStore() {
    const googleMapsUrl = "https://maps.app.goo.gl/9dWYd3jpDS869x577";

    return (
        <section id="visit-store" className="py-16 sm:py-24 bg-gradient-to-b from-secondary/30 via-background to-secondary/40 overflow-hidden border-t border-border/60">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">

                    {/* Left Column: Store Visual */}
                    <div className="lg:col-span-6">
                        <div className="relative group rounded-sm overflow-hidden border border-border/80 swatch-shadow bg-card">
                            <div className="aspect-[4/3] w-full overflow-hidden">
                                <img
                                    src="/raymondshop.jpeg"
                                    alt="Raymond Store in Khargone — Crazy Cut Piece Physical Location"
                                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                                />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-foreground/90 backdrop-blur-md text-primary-foreground p-4 rounded-sm border border-white/10 shadow-xl max-w-sm">
                                <div className="flex items-center gap-2.5">
                                    <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                                        Physical Store Experience
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-primary-foreground/80 leading-snug">
                                    Touch, feel &amp; inspect 5,000+ Raymond cut-piece fabrics in person.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Location Content */}
                    <div className="lg:col-span-6 flex flex-col items-start text-left">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                            VISIT US IN PERSON
                        </span>

                        <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-foreground text-balance">
                            Come See Us at Our Store
                        </h2>

                        <div className="brass-rule w-24 mt-6" />

                        <p className="mt-6 text-sm sm:text-base text-foreground/75 leading-relaxed max-w-xl">
                            Prefer to see and feel the fabric before you buy? Visit our store and explore our collection in person. Inspect genuine Raymond cottons, linens, and premium shirting sets with expert guidance.
                        </p>

                        {/* Location Details Box */}
                        <div className="mt-8 w-full p-6 sm:p-7 rounded-sm bg-card border border-border/80 swatch-shadow space-y-4">

                            {/* Address */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MapPin className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <h4 className="font-display font-semibold text-foreground text-base sm:text-lg">
                                        Shop Address
                                    </h4>
                                    <p className="mt-1 text-sm text-foreground/80 leading-relaxed font-medium">
                                        G16 &amp; Fuwara Chauk, Gajanan Soni Marg, near Sala Ka Ram Kachori, Khargone, Madhya Pradesh 451001, India
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-border/60 pt-4 grid sm:grid-cols-2 gap-4">
                                {/* Operating Hours */}
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-foreground/75 font-medium">
                                        {BRAND.hours}
                                    </span>
                                </div>

                                {/* Direct Phone/Contact */}
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-foreground/75 font-medium">
                                        +91 94253 33460
                                    </span>
                                </div>
                            </div>

                        </div>

                        {/* Get Directions CTA Button */}
                        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-foreground hover:bg-foreground/90 text-primary-foreground text-sm font-medium tracking-wide rounded-sm transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <Navigation className="w-4 h-4 text-accent" />
                                <span>Get Directions on Google Maps</span>
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
