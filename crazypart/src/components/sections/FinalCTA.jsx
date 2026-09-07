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
        <section className="py-14 sm:py-20 border-t border-border/60">
            <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                    Find a Fabric You’ll Love
                </span>
                <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-foreground text-balance">
                    What Our Customers Say
                </h2>
                <div className="brass-rule w-24 mx-auto mt-5" />
                <p className="mt-5 text-base sm:text-lg text-foreground/75 leading-relaxed max-w-xl mx-auto">
                    Real words from customers who’ve bought and worn our fabrics.
                </p>

                {/* Google Reviews Widget - Tighter Vertical Spacing */}
                <div className="mt-6 sm:mt-8 w-full flex justify-center">
                    <div
                        id="shapo-widget-233ac7f1f19c7035f683"
                        className="w-full max-w-3xl [&_iframe]:!mt-0 [&_div]:!mt-0 [&_iframe]:!pt-0"
                    ></div>
                </div>
            </div>
        </section>
    );
}