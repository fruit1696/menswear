import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured } from "@/api/supabaseClient";
import { queryKeys } from "@/api/queryKeys";
import { getActiveProductBySlug, listActiveProducts } from "@/features/products/productService";

export function useActiveProducts() {
    return useQuery({
        queryKey: queryKeys.products.list(),
        queryFn: listActiveProducts,
        enabled: isSupabaseConfigured,
    });
}

export function useActiveProduct(slug: string | undefined) {
    return useQuery({
        queryKey: queryKeys.products.detail(slug ?? ""),
        queryFn: () => getActiveProductBySlug(slug ?? ""),
        enabled: isSupabaseConfigured && Boolean(slug),
    });
}
