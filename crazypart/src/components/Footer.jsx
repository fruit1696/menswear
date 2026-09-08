import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { BRAND, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";
import { trackWhatsAppClick } from "@/lib/gtag";

export default function Footer() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside for mobile devices
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <footer id="contact" className="bg-foreground text-primary-foreground">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24 pb-24 md:pb-24">
                <div className="grid gap-12 md:grid-cols-12">
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <div className="flex flex-col leading-none">
                            <span className="font-display text-2xl font-semibold tracking-tight">
                                Crazy Cut Piece
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.25em] text-accent mt-1.5">
                                Raymond Shirting
                            </span>
                        </div>
                        <p className="mt-6 text-sm text-primary-foreground/70 max-w-sm leading-relaxed">
                            A curated gateway to Raymond shirt fabrics, sold as convenient
                            2-piece cut pieces. The fabrics shown online are only a glimpse —
                            the full collection is yours to discover on WhatsApp.
                        </p>
                        <a
                            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackWhatsAppClick('footer')}
                            className="mt-7 inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-sm font-medium tracking-wide rounded-sm transition-colors duration-300"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            WhatsApp Crazy Cut Piece
                        </a>
                    </div>

                    {/* Explore */}
                    <div className="md:col-span-3">
                        <h4 className="text-[11px] uppercase tracking-[0.25em] text-accent mb-5">
                            Explore
                        </h4>
                        <ul className="space-y-3 text-sm text-primary-foreground/75">
                            <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
                            <li><Link to="/fabrics" className="hover:text-primary-foreground transition-colors">Selected Fabrics</Link></li>
                            <li><Link to="/#concept" className="hover:text-primary-foreground transition-colors">2-Piece Concept</Link></li>
                            <li><Link to="/#about" className="hover:text-primary-foreground transition-colors">About</Link></li>
                        </ul>
                    </div>

                    {/* Reach Us & Policies */}
                    <div className="md:col-span-4 flex flex-col justify-between">
                        <div>
                            <h4 className="text-[11px] uppercase tracking-[0.25em] text-accent mb-5">
                                Reach Us
                            </h4>
                            <ul className="space-y-3 text-sm text-primary-foreground/75">
                                <li>{BRAND.location}</li>
                                <li>{BRAND.hours}</li>
                                <li>
                                    <a href={`mailto:${BRAND.email}`} className="hover:text-primary-foreground transition-colors">
                                        {BRAND.email}
                                    </a>
                                </li>
                            </ul>

                            {/* Social Media Icons */}
                            <div className="mt-6 pt-5 border-t border-white/10">
                                <h5 className="text-[11px] uppercase tracking-[0.25em] text-accent mb-3 font-medium">
                                    Follow Us
                                </h5>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={BRAND.socials?.instagram || "#"}
                                        aria-label="Instagram"
                                        className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-primary-foreground/75 hover:text-white hover:bg-white/15 hover:border-accent hover:scale-105 transition-all duration-300 shadow-sm"
                                    >
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={BRAND.socials?.facebook || "#"}
                                        aria-label="Facebook"
                                        className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-primary-foreground/75 hover:text-white hover:bg-white/15 hover:border-accent hover:scale-105 transition-all duration-300 shadow-sm"
                                    >
                                        <Facebook className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={BRAND.socials?.whatsapp || whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackWhatsAppClick('footer_social')}
                                        aria-label="WhatsApp"
                                        className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-primary-foreground/75 hover:text-white hover:bg-white/15 hover:border-accent hover:scale-105 transition-all duration-300 shadow-sm"
                                    >
                                        <WhatsAppIcon className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Hover/Tap Dropdown Menu */}
                        <div
                            ref={dropdownRef}
                            className="relative mt-8 group inline-block"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                type="button"
                                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-accent hover:text-primary-foreground transition-colors focus:outline-none py-1"
                                aria-expanded={dropdownOpen}
                            >
                                <span>Terms &amp; Policies</span>
                                <svg
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown panel positioned cleanly above button with padding bridge */}
                            <div
                                className={`absolute left-0 bottom-full pb-2 w-56 transition-all duration-200 ease-in-out z-50 ${dropdownOpen
                                        ? "opacity-100 visible translate-y-0"
                                        : "opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
                                    }`}
                            >
                                <div className="rounded-md bg-zinc-900 border border-white/15 shadow-2xl p-2">
                                    <div className="text-[10px] uppercase tracking-widest text-accent px-3 py-1.5 border-b border-white/10 font-semibold">
                                        Legal &amp; Policies
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            to="/policies/refund"
                                            className="block px-3 py-2 text-xs text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Refund Policy
                                        </Link>
                                        <Link
                                            to="/policies/privacy"
                                            className="block px-3 py-2 text-xs text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Privacy Policy
                                        </Link>
                                        <Link
                                            to="/policies/shipping"
                                            className="block px-3 py-2 text-xs text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Shipping Policy
                                        </Link>
                                        <Link
                                            to="/policies/terms"
                                            className="block px-3 py-2 text-xs text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Terms of Service
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-primary-foreground/50">
                        © {new Date().getFullYear()} Crazy Cut Piece. Fabrics by Raymond.
                    </p>
                    <p className="text-xs text-primary-foreground/50">
                        Online selection is a small gallery of our collection.
                    </p>
                </div>
            </div>
        </footer>
    );
}