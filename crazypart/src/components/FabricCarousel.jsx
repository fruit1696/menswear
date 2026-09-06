import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "@/components/ui/image";

/**
 * Fabric image carousel for the Selected Collection cards.
 * Touch/swipe on mobile, prev/next arrows + pagination dots on desktop.
 * Built on embla-carousel-react (already installed) — no new design system.
 * When a fabric has a single image, controls are hidden and it degrades to a static image.
 */
export default function FabricCarousel({ images, altBase, badge }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        dragFree: false,
        containScroll: "trimSnaps",
    });
    const [selected, setSelected] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setSelected(emblaApi.selectedScrollSnap());
            setCount(emblaApi.scrollSnapList().length);
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

    const multiple = images.length > 1;

    return (
        <div className="relative bg-secondary">
            {/* Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {images.map((src, i) => (
                        <div className="flex-[0_0_100%] min-w-0" key={i}>
                            <Image
                                src={src}
                                alt={`${altBase} — fabric view ${i + 1}`}
                                fittingType="fill"
                                className="w-full aspect-[4/5] object-cover"
                                loading={i === 0 ? "eager" : "lazy"}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 2-piece badge */}
            {badge && (
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <span className="inline-block px-3 py-1 bg-background/85 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] text-foreground rounded-sm">
                        {badge}
                    </span>
                </div>
            )}

            {/* Arrows — visible on touch & click for easy navigation */}
            {multiple && (
                <>
                    <button
                        onClick={scrollPrev}
                        disabled={selected === 0}
                        aria-label="Previous fabric image"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/85 backdrop-blur-sm text-foreground border border-border/70 hover:bg-background hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                    </button>
                    <button
                        onClick={scrollNext}
                        disabled={selected === count - 1}
                        aria-label="Next fabric image"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/85 backdrop-blur-sm text-foreground border border-border/70 hover:bg-background hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 shadow-sm"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                    </button>
                </>
            )}

            {/* Pagination dots — ● ○ ○ */}
            {multiple && (
                <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-2">
                    {Array.from({ length: count }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            aria-label={`Go to fabric image ${i + 1}`}
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i === selected
                                ? "bg-foreground scale-110"
                                : "border border-foreground/40 bg-transparent hover:border-foreground/70"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}