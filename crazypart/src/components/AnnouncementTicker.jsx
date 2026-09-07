import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCEMENTS = [
    "Premium Fabrics. Crazy Prices.",
    "Raymond Shirting. Up to 75% Off.",
    "2-Piece Shirt Sets.",
    "Choose Your Fabric. We'll Find the Match.",
    "Real Fabric. Real Availability. Order on WhatsApp.",
];

export default function AnnouncementTicker() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        }, 3200);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full bg-black text-white py-2.5 sm:py-2 px-4 text-center select-none border-b border-white/10">
            <div className="mx-auto max-w-7xl min-h-5 flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                        className="text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white/90 sm:whitespace-nowrap text-center leading-snug"
                    >
                        {ANNOUNCEMENTS[index]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
