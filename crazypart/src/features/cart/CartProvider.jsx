import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { mergeCartItems, normalizeQuantity, toCartProduct } from "@/features/cart/cartDomain";
import { clearGuestCart, readGuestCart, writeGuestCart } from "@/features/cart/cartStorage";
import { readUserCart, saveUserCart } from "@/features/cart/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [items, setItems] = useState(() => readGuestCart());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let active = true;
        if (!user) {
            setItems(readGuestCart());
            return undefined;
        }
        setIsLoading(true);
        Promise.all([readUserCart(user.id), Promise.resolve(readGuestCart())])
            .then(async ([remote, guest]) => {
                const merged = mergeCartItems([...remote.items, ...guest]);
                await saveUserCart(user.id, merged);
                clearGuestCart();
                if (active) setItems(merged);
            })
            .catch(() => { if (active) setItems([]); })
            .finally(() => active && setIsLoading(false));
        return () => { active = false; };
    }, [user]);

    const persist = useCallback(async (nextItems) => {
        const next = mergeCartItems(nextItems);
        setItems(next);
        if (user) await saveUserCart(user.id, next);
        else writeGuestCart(next);
    }, [user]);

    const addItem = useCallback((productId, quantity = 1, product) => {
        const current = items.find((item) => item.productId === productId);
        return persist([
            ...items.filter((item) => item.productId !== productId),
            {
                productId,
                quantity: normalizeQuantity((current?.quantity ?? 0) + quantity),
                product: toCartProduct(product) ?? current?.product,
            },
        ]);
    }, [items, persist]);

    const setQuantity = useCallback((productId, quantity) => {
        if (Number(quantity) <= 0) return persist(items.filter((item) => item.productId !== productId));
        return persist(items.map((item) => item.productId === productId
            ? { ...item, quantity: normalizeQuantity(quantity) }
            : item));
    }, [items, persist]);

    const removeItem = useCallback((productId) => persist(items.filter((item) => item.productId !== productId)), [items, persist]);
    const clearCart = useCallback(() => persist([]), [persist]);

    const value = useMemo(() => ({
        items,
        itemCount: items.reduce((total, item) => total + item.quantity, 0),
        isLoading,
        addItem,
        setQuantity,
        removeItem,
        clearCart,
    }), [items, isLoading, addItem, setQuantity, removeItem, clearCart]);
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}
