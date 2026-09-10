import React from "react";

/** Lightweight shared image component. */
export default function Image({
    src,
    alt,
    className,
    fittingType = "fill",
    focalPointX = undefined,
    focalPointY = undefined,
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
