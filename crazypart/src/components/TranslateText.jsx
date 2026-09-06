import React, { useState } from "react";
import { Languages } from "lucide-react";

/**
 * Inline translation toggle component.
 * Replaces English text with Hindi in place without modifying layout or adding duplicate text.
 */
export default function TranslateText({ english, hindi, className = "" }) {
    const [isHindi, setIsHindi] = useState(false);

    return (
        <div className={`inline-block ${className}`}>
            <div>{isHindi ? hindi : english}</div>
            <button
                type="button"
                onClick={() => setIsHindi((prev) => !prev)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-foreground transition-colors duration-200 cursor-pointer focus:outline-none"
                aria-label={isHindi ? "See English version" : "See Hindi translation"}
            >
                <Languages className="w-3.5 h-3.5" />
                <span>{isHindi ? "See English" : "See Translation (हिंदी)"}</span>
            </button>
        </div>
    );
}
