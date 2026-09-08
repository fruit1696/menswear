import React, { useState, useEffect } from "react";
import { WhatsAppIcon } from "@/components/Navbar";
import { whatsappLink } from "@/lib/brand";
import { trackWhatsAppClick } from "@/lib/gtag";
import TranslateText from "@/components/TranslateText";

const PROMPTS = [
    "Ask for: Blue Linens",
    "Ask for: Formal Whites",
    "Ask for: Evening Textures",
    "Ask for: Earthy Tones",
];

const POINTS = [
    "See more available fabrics",
    "Ask about colours and patterns",
    "Get actual fabric photos",
    "Choose what you like",
    "Order directly with us",
];

export default function WantMore() {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx((i) => (i + 1) % PROMPTS.length), 2600);
        return () => clearInterval(t);
    }, []);

    return (
        <section className="relative py-16 sm:py-24 bg-foreground text-primary-foreground overflow-hidden">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
                <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                    Want More?
                </span>
                <TranslateText
                    english={
                        <>
                            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-balance">
                                Looking for More Designs?
                            </h2>
                            <div className="brass-rule w-24 mt-6 mx-auto" />
                            <p className="mt-7 text-lg text-primary-foreground/75 leading-relaxed">
                                These are only a few examples from our collection. We have 5,000+ fabric varieties to choose from. Tell us what you're looking for and we'll show you the available options.
                            </p>
                        </>
                    }
                    hindi={
                        <>
                            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-balance">
                                अधिक डिज़ाइन देखना चाहते हैं?
                            </h2>
                            <div className="brass-rule w-24 mt-6 mx-auto" />
                            <p className="mt-7 text-lg text-primary-foreground/75 leading-relaxed">
                                ये हमारे संग्रह के केवल कुछ उदाहरण हैं। हमारे पास 5,000+ कपड़े के विकल्प उपलब्ध हैं। हमें बताएं कि आप क्या ढूंढ रहे हैं और हम आपको उपलब्ध विकल्प दिखाएंगे।
                            </p>
                        </>
                    }
                />

                <div className="mt-9 flex justify-center">
                    <a
                        href={whatsappLink("Hi Crazy Cut Piece, I'd like to see more shirt fabric designs.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick('want_more_section')}
                        className="inline-flex items-center gap-2.5 px-7 py-4 bg-white/10 hover:bg-white/15 text-sm font-medium tracking-wide rounded-sm transition-colors duration-300"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        WhatsApp Us — See More Fabrics
                    </a>
                </div>

                {/* Live feed prompt */}
                <div className="mt-12 border border-white/15 rounded-sm p-6 bg-white/5">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-accent mb-4">
                        On WhatsApp right now
                    </p>
                    <div className="h-8 overflow-hidden">
                        <p
                            key={idx}
                            className="font-display text-2xl text-primary-foreground animate-[fadeUp_0.6s_ease-out]"
                        >
                            {PROMPTS[idx]}
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <ul className="space-y-3.5">
                        {POINTS.map((p) => (
                            <li key={p} className="flex items-center gap-3 text-sm text-primary-foreground/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
}