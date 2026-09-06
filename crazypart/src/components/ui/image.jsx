import React from "react";

/**
 * Lightweight image component.
 * For media.base44.com / static.wixstatic.com URLs it would serve responsive srcset,
 * but for locally generated /__generating__ placeholders and other hosts it passes through.
 * Always safe to use — keeps a single consistent image API across the app.
 */
export default function Image({
    src,
    alt,
    className,
    fittingType = "fill",
    focalPointX,
    focalPointY,
    ...rest
}) {
    return (
        <img
            src={src}
            alt={alt}
            loading={rest.loading || "lazy"}
            className={className}
            {...rest}
        />
    );
}