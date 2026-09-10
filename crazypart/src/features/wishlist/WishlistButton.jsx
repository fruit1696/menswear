import { Heart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useWishlist } from "@/features/wishlist/wishlistQueries";

export default function WishlistButton({ productId, productName, compact = false }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { productIds, toggle, isLoading, isSaving } = useWishlist();

    if (!productId) return null;
    const isSaved = productIds.includes(productId);
    const handleClick = async (event) => {
        event.stopPropagation();
        if (!isAuthenticated) {
            navigate(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        await toggle({ productId, isSaved });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading || isSaving}
            aria-label={isSaved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
                title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                className={`absolute right-3 top-3 z-20 flex items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-colors hover:text-accent disabled:opacity-60 ${compact ? "h-11 w-11" : "h-9 w-9"}`}
        >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 transition-colors duration-200 ${isSaved ? "fill-[#C62828] text-[#C62828]" : ""}`} />}
        </button>
    );
}
