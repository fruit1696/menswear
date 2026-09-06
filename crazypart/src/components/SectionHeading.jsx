import React from "react";

/**
 * Reusable section heading with the signature brass underline.
 */
export default function SectionHeading({ eyebrow, title, align = "left", light = false }) {
    const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
    return (
        <div className={`flex flex-col ${alignment} gap-4`}>
            {eyebrow && (
                <span className={`text-[11px] uppercase tracking-[0.3em] ${light ? "text-accent" : "text-accent"}`}>
                    {eyebrow}
                </span>
            )}
            <h2
                className={`font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-balance ${light ? "text-primary-foreground" : "text-foreground"
                    }`}
            >
                {title}
            </h2>
            <div className={`brass-rule w-24 ${align === "center" ? "mx-auto" : ""}`} />
        </div>
    );
}