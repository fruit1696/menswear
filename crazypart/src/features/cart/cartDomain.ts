export const MAX_CART_QUANTITY = 50;

export function toCartProduct(product) {
    if (!product) return undefined;

    const pricePaise = Number.isFinite(Number(product.price_paise))
        ? Number(product.price_paise)
        : Math.round(Number(String(product.price ?? "").split("/")[0].replace(/[^0-9.]/g, "")) * 100);

    return {
        name: product.name,
        price_paise: pricePaise,
        image: product.image,
        images: product.images,
    };
}

export function normalizeQuantity(quantity) {
    return Math.max(1, Math.min(MAX_CART_QUANTITY, Math.trunc(Number(quantity) || 1)));
}

export function mergeCartItems(items) {
    const merged = new Map();
    for (const item of items) {
        if (!item?.productId) continue;
        const existing = merged.get(item.productId);
        merged.set(item.productId, {
            quantity: normalizeQuantity((existing?.quantity ?? 0) + item.quantity),
            product: item.product ?? existing?.product,
        });
    }
    return [...merged.entries()].map(([productId, item]) => ({ productId, ...item }));
}
