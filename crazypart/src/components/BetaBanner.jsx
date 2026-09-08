import React from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Top notification banner for demo/portfolio disclaimer.
 */
export default function BetaBanner() {
    // Banner disabled — uncomment the return block below to re-enable
    return null;

    /* return (
        <div className="w-full bg-zinc-900 text-amber-400 border-b border-amber-500/20 py-2.5 px-4 text-center select-none z-50">
            <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                    <strong className="font-semibold uppercase tracking-wider text-amber-300">DEMO SITE NOTICE:</strong> This website is currently in beta testing for portfolio and demonstration purposes only. No orders or payments will be processed or honored.
                </span>
            </div>
        </div>
    ); */
}
