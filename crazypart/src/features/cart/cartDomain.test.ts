import { describe, expect, it } from "vitest";
import { MAX_CART_QUANTITY, mergeCartItems, normalizeQuantity } from "@/features/cart/cartDomain";

describe("cart domain", () => {
    it("clamps quantities to the supported range", () => {
        expect(normalizeQuantity(0)).toBe(1);
        expect(normalizeQuantity(3.8)).toBe(3);
        expect(normalizeQuantity(MAX_CART_QUANTITY + 10)).toBe(MAX_CART_QUANTITY);
    });

    it("merges duplicate products and caps the combined quantity", () => {
        expect(mergeCartItems([
            { productId: "one", quantity: 2 },
            { productId: "one", quantity: 4 },
            { productId: "two", quantity: 1 },
        ])).toEqual([
            { productId: "one", quantity: 6 },
            { productId: "two", quantity: 1 },
        ]);
        expect(mergeCartItems([{ productId: "one", quantity: MAX_CART_QUANTITY }, { productId: "one", quantity: 1 }]))
            .toEqual([{ productId: "one", quantity: MAX_CART_QUANTITY }]);
    });

    it("ignores malformed items without product IDs", () => {
        expect(mergeCartItems([null, {}, { productId: "valid", quantity: 2 }]))
            .toEqual([{ productId: "valid", quantity: 2 }]);
    });
});
