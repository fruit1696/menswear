import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WhatsAppIcon } from "@/components/Navbar";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";
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
            alt: "Raymond shirt fabric — Request live photos.",
            href: "#pick-your-style",
            isExternal: false,
            label: "Request live photos.",
        },
        {
            src: "/pic3.jpeg",
            alt: "Raymond shirt fabric — The Concept",
            href: "#concept",
            isExternal: false,
            label: "The Concept",
        },
         {
            src: "/pic4.jpeg",
            alt: "Raymond shirt fabric — The Concept",
            href: "#concept",
            isExternal: false,
            label: "The Concept",
        },
         {
            src: "/pic5.jpeg",
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

    const scrollPrev = useCallback(
        (e) => {
            e?.preventDefault?.();
            emblaApi?.scrollPrev();
        },
        [emblaApi]
    );

    const scrollNext = useCallback(
        (e) => {
            e?.preventDefault?.();
            emblaApi?.scrollNext();
        },
        [emblaApi]
    );

    return (
        /* Changed bg-background to bg-white */
        <section id="hero-section" className="relative min-h-[100svh] flex flex-col items-center justify-between overflow-hidden bg-white pt-32 sm:pt-36 pb-12 px-5 sm:px-8">
            <h1 className="sr-only">Raymond Shirt Fabric Online | Crazy Cutpiece</h1>

            {/* Main Content Composition */}
            <div className="relative z-10 mx-auto max-w-4xl md:max-w-7xl md:w-[85vw] w-full flex flex-col items-center gap-6 sm:gap-8 text-center my-auto">

                {/* 1. FABRIC CAROUSEL */}
                <div className="w-full max-w-[600px] md:max-w-7xl md:w-[85vw] flex flex-col items-center gap-4">
                    {/* Carousel Container with Touch/Swipe */}
                    <div className="relative w-full overflow-visible group">

                        {/* Embla Viewport */}
                        <div className="overflow-hidden w-full touch-pan-y" ref={emblaRef}>
                            <div className="flex -ml-4 md:-ml-6">
                                {heroSlides.map((slide, idx) => (
                                    <div className="flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0 relative pl-4 md:pl-6" key={idx}>
                                        <div className="w-full h-full aspect-[9/16] rounded-2xl overflow-hidden border border-border/80 bg-white shadow-lg">
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
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={scrollPrev}
                            aria-label="Previous fabric"
                            className="absolute -left-5 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-transparent text-foreground transition-colors duration-200 hover:text-accent active:text-accent sm:hidden"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            type="button"
                            onClick={scrollNext}
                            aria-label="Next fabric"
                            className="absolute -right-5 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-transparent text-foreground transition-colors duration-200 hover:text-accent active:text-accent sm:hidden"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                    </div>

                    {/* Carousel Navigation: Previous, Pagination, Next */}
                    <div className="flex items-center justify-center gap-4 pt-1">
                        <button
                            type="button"
                            onClick={scrollPrev}
                            aria-label="Previous fabric"
                            className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 text-foreground shadow-sm transition-colors duration-200 hover:bg-neutral-300 active:bg-neutral-300 sm:flex"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex min-w-[4.5rem] items-center justify-center gap-2" aria-label="Carousel pagination">
                            {heroSlides.map((_, idx) => (
                                <button
                                    type="button"
                                    key={idx}
                                    onClick={() => emblaApi?.scrollTo(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    aria-current={idx === currentSlide ? "true" : undefined}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                                        ? "w-6 bg-accent"
                                        : "w-2 bg-foreground/20 hover:bg-foreground/40"
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={scrollNext}
                            aria-label="Next fabric"
                            className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 text-foreground shadow-sm transition-colors duration-200 hover:bg-neutral-300 active:bg-neutral-300 sm:flex"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
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
