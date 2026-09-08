import React, { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "@/components/ui/image";
import { WhatsAppIcon } from "@/components/Navbar";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";
import { IMAGES } from "@/lib/images";
import { BadgeCheck, Scissors, Feather, Truck, ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
    const heroSlides = [
        {
            src: "/pic1.jpeg",
            alt: "Raymond shirt fabric — Order Now",
            href: "#pick-your-style",
            isExternal: false,
            label: "Order Here",
        },
        {
            src: "/pic2.jpeg",
            alt: "Raymond shirt fabric — Pick Your Style",
            href: "#pick-your-style",
            isExternal: false,
            label: "Pick Your Style",
        },
        {
            src: "/pic3.jpeg",
            alt: "Raymond shirt fabric — The Concept",
            href: "#concept",
            isExternal: false,
            label: "The Concept",
        },
    ];

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        dragFree: false,
        containScroll: "trimSnaps",
    });
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setCurrentSlide(emblaApi.selectedScrollSnap());
        };
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    // ── Autoplay ──────────────────────────────────────────────
    const autoplayRef = useRef(null);

    const startAutoplay = useCallback(() => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
        autoplayRef.current = setInterval(() => {
            emblaApi?.scrollNext();
        }, 4500);
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        startAutoplay();
        // Reset timer on any user-initiated interaction
        emblaApi.on("pointerDown", startAutoplay);
        return () => {
            clearInterval(autoplayRef.current);
            emblaApi.off("pointerDown", startAutoplay);
        };
    }, [emblaApi, startAutoplay]);
    // ─────────────────────────────────────────────────────────

    const scrollPrev = useCallback(
        (e) => {
            e?.preventDefault?.();
            emblaApi?.scrollPrev();
            startAutoplay();
        },
        [emblaApi, startAutoplay]
    );

    const scrollNext = useCallback(
        (e) => {
            e?.preventDefault?.();
            emblaApi?.scrollNext();
            startAutoplay();
        },
        [emblaApi, startAutoplay]
    );

    return (
        /* Changed bg-background to bg-white */
        <section id="hero-section" className="relative min-h-[100svh] flex flex-col items-center justify-between overflow-hidden bg-white pt-32 sm:pt-36 pb-12 px-5 sm:px-8">
            <h1 className="sr-only">Raymond Shirt Fabric Online | Crazy Cut Piece</h1>

            {/* Main Content Composition */}
            <div className="relative z-10 mx-auto max-w-4xl w-full flex flex-col items-center gap-6 sm:gap-8 text-center my-auto">

                {/* 1. FABRIC CAROUSEL */}
                <div className="w-full max-w-[600px] flex flex-col items-center gap-4">
                    {/* Carousel Container with Touch/Swipe */}
                    <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border border-border/80 bg-white shadow-lg flex items-center justify-center group">

                        {/* Embla Viewport */}
                        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                            <div className="flex h-full">
                                {heroSlides.map((slide, idx) => (
                                    <div className="flex-[0_0_100%] min-w-0 h-full relative" key={idx}>
                                        <a
                                            href={slide.href}
                                            target={slide.isExternal ? "_blank" : undefined}
                                            rel={slide.isExternal ? "noopener noreferrer" : undefined}
                                            onClick={slide.onClick}
                                            className="block w-full h-full cursor-pointer relative"
                                            aria-label={slide.label}
                                        >
                                            <img
                                                src={slide.src}
                                                alt={slide.alt}
                                                className="w-full h-full object-cover select-none"
                                                draggable={false}
                                            />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carousel Navigation Arrows */}
                        <button
                            onClick={scrollPrev}
                            aria-label="Previous fabric"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-foreground flex items-center justify-center border border-border shadow-sm transition-all duration-200 z-10"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            aria-label="Next fabric"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-foreground flex items-center justify-center border border-border shadow-sm transition-all duration-200 z-10"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                        {heroSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => emblaApi?.scrollTo(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide
                                    ? "w-6 bg-accent"
                                    : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Optional Desktop WhatsApp CTA */}
                <div className="hidden sm:flex items-center justify-center">
                    <a
                        href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick('hero')}
                        className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#1E5E41] hover:bg-[#184C35] text-white text-sm font-medium tracking-wide rounded-full transition-colors duration-300 shadow-md"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        ORDER ON WHATSAPP
                    </a>
                </div>
            </div>

            {/* 3. TRUST PILLARS */}
            <div className="relative z-10 w-full max-w-4xl mx-auto border-t border-border/30 pt-5 mt-6">
                <div className="flex flex-row items-center w-full justify-between sm:justify-center gap-2 sm:gap-8 text-foreground/80">
                    <div className="flex flex-col items-center gap-1.5 flex-1 sm:flex-none text-center">
                        <BadgeCheck className="w-6 h-6 sm:w-7 sm:h-7 text-accent flex-shrink-0" />
                        <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-medium leading-tight">
                            <span className="sm:hidden">Original Fabric</span>
                            <span className="hidden sm:inline">100% Original Fabric</span>
                        </span>
                    </div>

                    <span className="text-foreground/20 flex-shrink-0 text-sm sm:text-base self-center">|</span>

                    <div className="flex flex-col items-center gap-1.5 flex-1 sm:flex-none text-center">
                        <Scissors className="w-6 h-6 sm:w-7 sm:h-7 text-accent flex-shrink-0" />
                        <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-medium leading-tight">
                            <span className="sm:hidden">Unstitched</span>
                            <span className="hidden sm:inline">Unstitched Shirt Fabric</span>
                        </span>
                    </div>

                    <span className="text-foreground/20 flex-shrink-0 text-sm sm:text-base self-center">|</span>

                    <div className="flex flex-col items-center gap-1.5 flex-1 sm:flex-none text-center">
                        <Feather className="w-6 h-6 sm:w-7 sm:h-7 text-accent flex-shrink-0" />
                        <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-medium leading-tight">
                            <span className="sm:hidden">Soft & Comfortable</span>
                            <span className="hidden sm:inline">Smooth, Soft & Comfortable Feel</span>
                        </span>
                    </div>

                    <span className="text-foreground/20 flex-shrink-0 text-sm sm:text-base self-center">|</span>

                    <div className="flex flex-col items-center gap-1.5 flex-1 sm:flex-none text-center">
                        <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-accent flex-shrink-0" />
                        <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-medium leading-tight">
                            Free Shipping
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}