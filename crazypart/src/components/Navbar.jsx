import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UserRound, ShoppingBag, Heart } from "lucide-react";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import BetaBanner from "@/components/BetaBanner";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/features/cart/CartProvider";

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Shop Fabrics", to: "/fabrics" },
    { label: "2-Piece Concept", to: "/#concept" },
    { label: "About Us", to: "/#about" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const isHeroNavigation = location.pathname === "/";
    const { itemCount } = useCart();
    const { isAuthenticated, logout } = useAuth();

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
            <BetaBanner />
            <AnnouncementTicker />
            <nav className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <div className="relative flex items-center justify-between h-16 sm:h-20 w-full">
                    <button
                        className="absolute left-0 z-20 p-2 text-foreground pointer-events-auto md:hidden"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    {/* Left: Navigation and account actions */}
                    <div className="hidden flex-1 items-center gap-5 z-10 md:flex lg:gap-7">
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.label}
                                to={l.to}
                                className="text-sm font-medium tracking-wide text-foreground/75 hover:text-foreground transition-colors duration-300 whitespace-nowrap"
                            >
                                {l.label}
                            </Link>
                        ))}
                        <Link to="/account" className="p-2 text-foreground hover:text-accent" aria-label="Account" title="Account">
                            <UserRound className="h-5 w-5" />
                        </Link>
                        <Link to="/account" className="text-sm font-medium text-foreground/75 hover:text-foreground">Account</Link>
                        <a
                            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackWhatsAppClick('navbar_desktop')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm hover:bg-foreground/90 transition-colors duration-300 whitespace-nowrap"
                        >
                    
                        </a>
                    </div>

                    {/* Center: Brand Name (Crazy Cutpiece) */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <Link to="/" className="group flex flex-col leading-none text-center pointer-events-auto">
                            <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-accent whitespace-nowrap">
                                Crazy Cutpiece
                            </span>
                        </Link>
                    </div>

                    {/* Right: Shopping shortcuts */}
                    <div className="ml-auto flex flex-1 items-center justify-end gap-3 z-10">
                        <Link to="/cart" className="relative flex h-9 w-9 items-center justify-center text-foreground hover:text-accent" aria-label={`Cart with ${itemCount} items`} title="Cart">
                            <ShoppingBag className="h-5 w-5" />
                            {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">{itemCount}</span>}
                        </Link>
                        {isHeroNavigation ? <Link to={isAuthenticated ? "/account" : "/login?returnTo=%2Faccount"} className="flex h-9 w-9 items-center justify-center text-foreground hover:text-accent" aria-label={isAuthenticated ? "Account" : "Login or sign up"} title={isAuthenticated ? "Account" : "Login / Sign Up"}>
                            <UserRound className="h-5 w-5" />
                        </Link> : <Link to="/wishlist" className="flex h-9 w-9 items-center justify-center text-foreground hover:text-accent" aria-label="Wishlist" title="Wishlist">
                            <Heart className="h-5 w-5" />
                        </Link>}
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
                        <Link to="/account" className="py-3 text-base text-foreground/80 border-b border-border/40">Account</Link>
                        <Link to="/wishlist" className="py-3 text-base text-foreground/80 border-b border-border/40">Wishlist</Link>
                        <Link to="/cart" className="py-3 text-base text-foreground/80 border-b border-border/40">Cart</Link>
                        {isAuthenticated && <button type="button" onClick={logout} className="py-3 text-left text-base text-foreground/80 border-b border-border/40">Sign out</button>}

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
