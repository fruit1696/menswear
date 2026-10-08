import { describe, expect, it } from "vitest";
import { FEATURED_COLLECTIONS } from "@/lib/featuredCollections";

const commerceFields = ["id", "productId", "name", "price", "image", "images", "originalPrice", "deliveryLeadDays"];

describe("featured collection product contracts", () => {
    it.each(["white", "blue"])("gives every %s collection product the shared card and detail fields", (collectionId) => {
        for (const product of FEATURED_COLLECTIONS[collectionId].varieties) {
            for (const field of commerceFields) expect(product[field], `${product.id}.${field}`).toBeTruthy();
        }
    });

    it("uses unique product IDs across both collections", () => {
        const productIds = Object.values(FEATURED_COLLECTIONS)
            .flatMap((collection) => collection.varieties.map((product) => product.productId));

        expect(new Set(productIds).size).toBe(productIds.length);
    });
});
