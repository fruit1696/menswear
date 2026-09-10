import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { listWishlistProductIds, addWishlistItem, removeWishlistItem } from "@/features/wishlist/wishlistService";

export const wishlistKey = (userId) => ["wishlist", userId];

export function useWishlist() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: wishlistKey(user?.id),
        queryFn: () => listWishlistProductIds(user.id),
        enabled: Boolean(user?.id),
    });
    const mutation = useMutation({
        mutationFn: ({ productId, isSaved }) => isSaved
            ? removeWishlistItem(user.id, productId)
            : addWishlistItem(user.id, productId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: wishlistKey(user?.id) }),
    });

    return { productIds: query.data ?? [], isLoading: query.isLoading, toggle: mutation.mutateAsync, isSaving: mutation.isPending };
}
