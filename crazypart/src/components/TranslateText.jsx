import React, { useState } from "react";
import { Languages } from "lucide-react";

/**
 * Inline translation toggle component.
 * Replaces English text with Hindi in place without modifying layout or adding duplicate text.
 */
export default function TranslateText({ english, hindi, className = "", buttonClassName = "" }) {
    const [isHindi, setIsHindi] = useState(false);

    return (
        <div className={`block ${className}`}>
            <div>{isHindi ? hindi : english}</div>
            <button
                type="button"
                onClick={() => setIsHindi((prev) => !prev)}
                className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-80 transition-all duration-200 cursor-pointer focus:outline-none ${buttonClassName}`}
                aria-label={isHindi ? "See English version" : "See Hindi translation"}
            >
                <Languages className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{isHindi ? "See English" : "See Translation (हिंदी)"}</span>
            </button>
        </div>
    );
}

