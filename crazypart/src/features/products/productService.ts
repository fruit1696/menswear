import { requireSupabase } from "@/api/supabaseClient";
import type { Database } from "@/api/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export type ProductWithImages = Product & { images: ProductImage[] };

export function productToFabric(product: ProductWithImages) {
    const client = requireSupabase();
    const images = product.images.map((image) =>
        client.storage.from("product-images").getPublicUrl(image.object_path).data.publicUrl
    );

    return {
        id: product.slug,
        productId: product.id,
        name: product.name,
        code: product.sku,
        category: product.category,
        fabricType: product.fabric_type,
        color: product.color,
        pattern: product.pattern,
        tone: product.color ?? "Selected weave",
        description: product.description,
        price: `₹${Math.round(product.price_paise / 100)}/2-piece`,
        image: images[0],
        images,
    };
}

const productSelect = "id, name, slug, description, price_paise, sku, category, fabric_type, color, pattern, status, created_at, updated_at";
const imageSelect = "id, product_id, object_path, alt_text, sort_order, is_primary, created_at";

export async function listActiveProducts(): Promise<ProductWithImages[]> {
    const client = requireSupabase();
    const { data, error } = await client
        .from("products")
        .select(productSelect)
        .eq("status", "active")
        .order("created_at", { ascending: false });

    if (error) throw error;

    const products = data ?? [];
    if (!products.length) return [];

    const { data: imageData, error: imageError } = await client
        .from("product_images")
        .select(imageSelect)
        .in("product_id", products.map((product) => product.id))
        .order("sort_order", { ascending: true });

    if (imageError) throw imageError;
    const imagesByProduct = new Map<string, ProductImage[]>();
    for (const image of imageData ?? []) {
        const images = imagesByProduct.get(image.product_id) ?? [];
        images.push(image);
        imagesByProduct.set(image.product_id, images);
    }

    return products.map((product) => ({
        ...product,
        images: imagesByProduct.get(product.id) ?? [],
    }));
}

export async function getActiveProductBySlug(slug: string): Promise<ProductWithImages | null> {
    const client = requireSupabase();
    const { data, error } = await client
        .from("products")
        .select(productSelect)
        .eq("slug", slug)
        .eq("status", "active")
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const { data: imageData, error: imageError } = await client
        .from("product_images")
        .select(imageSelect)
        .eq("product_id", data.id)
        .order("sort_order", { ascending: true });

    if (imageError) throw imageError;

    return {
        ...data,
        images: imageData ?? [],
    };
}
