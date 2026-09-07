import React, { useState, useEffect } from "react";
import { WhatsAppIcon } from "@/components/Navbar";
import { whatsappLink } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";

function useShopHours() {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const hours = now.getHours();
            setIsOnline(hours >= 11 && hours < 19);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return isOnline;
}

export default function FinalCTA() {
    const isOnline = useShopHours();
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (!document.getElementById("shapo-embed-js")) {
            const script = document.createElement("script");
            script.id = "shapo-embed-js";
            script.type = "text/javascript";
            script.src = "https://cdn.shapo.io/js/embed.js";
            script.defer = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <section className="py-24 sm:py-40">
            <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
                <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                    Your Fabric Awaits
                </span>
                <h2 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02] tracking-tight text-foreground text-balance">
                    Ready to Find Your Fabric?
                </h2>
                <div className="brass-rule w-24 mx-auto mt-7" />
                <p className="mt-7 text-lg text-foreground/75 leading-relaxed max-w-xl mx-auto">
                    Tell us what you're looking for and we'll show you what's available.
                </p>

                <div
                    className="relative mt-10 inline-block group"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onTouchStart={() => setShowTooltip(true)}
                    onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2500)}
                >
                    {/* Hover & Touch Tooltip Popover */}
                    <div
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-200 pointer-events-none z-30 ${
                            showTooltip
                                ? "opacity-100 translate-y-0 scale-100"
                                : "opacity-0 translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                        }`}
                    >
                        <div className="px-4 py-2.5 bg-card border border-border/90 rounded-md shadow-2xl whitespace-nowrap text-center">
                            <div className="inline-flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                    {isOnline ? "We're online" : "Currently offline"}
                                </span>
                            </div>
                            <p className="text-[11px] text-foreground/75 mt-0.5 font-medium">
                                {isOnline ? "Usually reply within 5–10 minutes" : "We'll reply from 11 AM"}
                            </p>
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="w-2.5 h-2.5 bg-card border-r border-b border-border/90 rotate-45 mx-auto -mt-1.5" />
                    </div>

                    <a
                        href={whatsappLink("Hi Crazy Cut Piece, I'm looking for shirt fabric. Can you show me what's currently available?")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick('final_cta')}
                        className="inline-flex items-center gap-2.5 px-8 py-4 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm hover:bg-foreground/90 transition-colors duration-300 shadow-md"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        ORDER ON WHATSAPP
                    </a>
                </div>

                {/* Google Reviews Widget */}
                <div className="mt-20 w-full flex justify-center">
                    <div id="shapo-widget-233ac7f1f19c7035f683"></div>
                </div>
            </div>
        </section>
    );
}