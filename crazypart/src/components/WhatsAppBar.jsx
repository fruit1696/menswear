import React, { useState, useEffect } from "react";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";
import { trackWhatsAppClick } from "@/lib/gtag";

/**
 * Mobile-only fixed bottom action bar for WhatsApp order.
 * Appears only when user has scrolled past the Hero section.
 */
export default function WhatsAppBar() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const heroEl = document.getElementById("hero-section");
        if (!heroEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Hide when hero is intersecting (visible), show when hero is out of view
                setShowButton(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(heroEl);
        return () => observer.disconnect();
    }, []);

    if (!showButton) return null;

    return (
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none transition-all duration-300">
            <div className="w-full flex justify-center pointer-events-auto">
                <a
                    href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('sticky_bar')}
                    className="w-full max-w-sm inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#1E5E41] active:bg-[#184C35] text-white text-sm font-medium tracking-wide rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-200"
                >
                    <WhatsAppIcon className="w-4 h-4" />
                    ORDER ON WHATSAPP
                </a>
            </div>
        </div>
    );
}