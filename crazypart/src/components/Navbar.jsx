import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BRAND, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/brand";
import AnnouncementTicker from "@/components/AnnouncementTicker";

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Fabrics", to: "/fabrics" },
    { label: "2-Piece Concept", to: "/#concept" },
    { label: "About", to: "/#about" },
    { label: "Contact", to: "/#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setOpen(false), [location]);

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-background/95 backdrop-blur-md border-b border-border/60"
                : "bg-background/80 backdrop-blur-sm"
                }`}
        >
            <AnnouncementTicker />
            <nav className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <div className="relative flex items-center justify-between h-16 sm:h-20 w-full">
                    {/* Left: Navigation Menu */}
                    <div className="hidden md:flex items-center gap-5 lg:gap-7 z-10">
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.label}
                                to={l.to}
                                className="text-sm font-medium tracking-wide text-foreground/75 hover:text-foreground transition-colors duration-300 whitespace-nowrap"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Center: Brand Name (Crazy Cut Piece) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Link to="/" className="group flex flex-col leading-none text-center pointer-events-auto">
                            <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-accent whitespace-nowrap">
                                Crazy Cut Piece
                            </span>
                        </Link>
                    </div>

                    {/* Right: WhatsApp Button & Mobile Menu Toggle */}
                    <div className="flex items-center gap-3 z-10">
                        <a
                            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm hover:bg-foreground/90 transition-colors duration-300 whitespace-nowrap"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            WhatsApp Us
                        </a>

                        <button
                            className="md:hidden p-2 -mr-2 text-foreground pointer-events-auto"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-border/60 bg-background">
                    <div className="px-5 py-6 flex flex-col gap-1">
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.label}
                                to={l.to}
                                className="py-3 text-base text-foreground/80 border-b border-border/40"
                            >
                                {l.label}
                            </Link>
                        ))}
                        <a
                            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}

export function WhatsAppIcon({ className }) {
    return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
        </svg>
    );
}