import React from "react";
import { MapPin, Navigation, Clock, Phone, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function VisitStore() {
    const googleMapsUrl = "https://maps.app.goo.gl/9dWYd3jpDS869x577";

    return (
        <section id="visit-store" className="py-12 sm:py-16 bg-gradient-to-b from-secondary/30 via-background to-secondary/40 overflow-hidden border-t border-border/60">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 flex flex-col items-center text-center">

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

                {/* Highlight Badge (previously floating on the image) */}
                <div className="mt-8 bg-foreground/90 backdrop-blur-md text-primary-foreground p-4 rounded-sm border border-white/10 shadow-lg max-w-sm flex flex-col items-center text-center">
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                            Physical Store Experience
                        </span>
                    </div>
                    <p className="mt-1.5 text-xs text-primary-foreground/80 leading-snug">
                        Touch, feel &amp; inspect 5,000+ Raymond cut-piece fabrics in person.
                    </p>
                </div>

                {/* Location Details Box */}
                <div className="mt-8 w-full p-6 sm:p-7 rounded-sm bg-card border border-border/80 swatch-shadow flex flex-col items-center space-y-5">
                    
                    {/* Address */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                            <h4 className="font-display font-semibold text-foreground text-base sm:text-lg">
                                Shop Address
                            </h4>
                            <p className="mt-1 text-sm text-foreground/80 leading-relaxed font-medium max-w-sm mx-auto">
                               Radha Vallabhi Market, Fuwara Chauk,Khargone, Madhya Pradesh 451001, India
                            </p>
                        </div>
                    </div>

                    <div className="w-full border-t border-border/60 pt-5 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
                        {/* Operating Hours */}
                        <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-accent" />
                            <span className="text-xs sm:text-sm text-foreground/75 font-medium">
                                {BRAND.hours}
                            </span>
                        </div>

                        {/* Direct Phone/Contact */}
                        <div className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-accent" />
                            <span className="text-xs sm:text-sm text-foreground/75 font-medium">
                                +91 94253 33460
                            </span>
                        </div>
                    </div>

                </div>

                {/* Get Directions CTA Button */}
                <div className="mt-10">
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-foreground hover:bg-foreground/90 text-primary-foreground text-sm font-medium tracking-wide rounded-sm transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <Navigation className="w-4 h-4 text-accent" />
                        <span>Get Directions on Google Maps</span>
                    </a>
                </div>

            </div>
        </section>
    );
}
