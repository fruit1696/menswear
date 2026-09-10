import { mergeCartItems } from "@/features/cart/cartDomain";

const STORAGE_KEY = "crazy-cutpiece-guest-cart";

export function readGuestCart() {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? mergeCartItems(JSON.parse(stored)) : [];
    } catch {
        return [];
    }
}

export function writeGuestCart(items) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mergeCartItems(items)));
}

export function clearGuestCart() {
    window.localStorage.removeItem(STORAGE_KEY);
}
