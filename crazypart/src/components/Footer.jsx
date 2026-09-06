import React from "react";
import { Link } from "react-router-dom";
import { BRAND, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";

export default function Footer() {
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

                    {/* Contact */}
                    <div className="md:col-span-4">
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