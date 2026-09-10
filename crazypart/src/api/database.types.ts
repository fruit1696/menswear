export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    phone: string | null;
                    role: "customer" | "admin";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    phone?: string | null;
                    role?: "customer" | "admin";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
                Relationships: [];
            };
            products: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string;
                    price_paise: number;
                    sku: string;
                    category: string | null;
                    fabric_type: string | null;
                    color: string | null;
                    pattern: string | null;
                    status: "draft" | "active" | "archived";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string;
                    price_paise: number;
                    sku: string;
                    category?: string | null;
                    fabric_type?: string | null;
                    color?: string | null;
                    pattern?: string | null;
                    status?: "draft" | "active" | "archived";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "product_images_product_id_fkey";
                        columns: ["id"];
                        isOneToOne: false;
                        referencedRelation: "product_images";
                        referencedColumns: ["product_id"];
                    },
                ];
            };
            product_images: {
                Row: {
                    id: string;
                    product_id: string;
                    object_path: string;
                    alt_text: string;
                    sort_order: number;
                    is_primary: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    object_path: string;
                    alt_text?: string;
                    sort_order?: number;
                    is_primary?: boolean;
                    created_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "product_images_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
            };
            inventory: {
                Row: {
                    product_id: string;
                    stock_quantity: number;
                    updated_at: string;
                };
                Insert: {
                    product_id: string;
                    stock_quantity?: number;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["inventory"]["Insert"]>;
                Relationships: [];
            };
            wishlists: {
                Row: {
                    user_id: string;
                    product_id: string;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    product_id: string;
                    created_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["wishlists"]["Insert"]>;
                Relationships: [];
            };
            carts: {
                Row: {
                    id: string;
                    user_id: string;
                    status: "active" | "converted" | "abandoned";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    status?: "active" | "converted" | "abandoned";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["carts"]["Insert"]>;
                Relationships: [];
            };
            cart_items: {
                Row: {
                    id: string;
                    cart_id: string;
                    product_id: string;
                    quantity: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    cart_id: string;
                    product_id: string;
                    quantity: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
                Relationships: [];
            };
            orders: {
                Row: {
                    id: string;
                    order_number: string;
                    user_id: string;
                    status: "pending_payment" | "paid" | "payment_failed" | "cancelled" | "processing" | "shipped" | "delivered" | "refunded";
                    subtotal_paise: number;
                    shipping_paise: number;
                    total_paise: number;
                    currency: "INR";
                    shipping_address: Json;
                    razorpay_order_id: string | null;
                    stock_allocated: boolean;
                    stock_released: boolean;
                    expires_at: string | null;
                    paid_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & { order_number: string; user_id: string; shipping_address: Json };
                Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
                Relationships: [];
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string | null;
                    product_name: string;
                    sku: string;
                    category: string | null;
                    fabric_type: string | null;
                    color: string | null;
                    pattern: string | null;
                    unit_price_paise: number;
                    quantity: number;
                    line_total_paise: number;
                };
                Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]> & { order_id: string; product_name: string; sku: string; unit_price_paise: number; quantity: number; line_total_paise: number };
                Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
                Relationships: [];
            };
            addresses: {
                Row: {
                    id: string;
                    user_id: string;
                    recipient_name: string;
                    phone: string;
                    line1: string;
                    line2: string | null;
                    city: string;
                    state: string;
                    postal_code: string;
                    country_code: string;
                    is_default: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    recipient_name: string;
                    phone: string;
                    line1: string;
                    line2?: string | null;
                    city: string;
                    state: string;
                    postal_code: string;
                    country_code?: string;
                    is_default?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
                Relationships: [];
            };
            reviews: {
                Row: {
                    id: string;
                    product_id: string;
                    user_id: string;
                    order_id: string;
                    author_name: string;
                    rating: number;
                    review_text: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    user_id: string;
                    order_id: string;
                    author_name?: string;
                    rating: number;
                    review_text: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: {
            create_pending_order: {
                Args: { p_items: Json; p_shipping_address: Json };
                Returns: Json;
            };
            cancel_pending_order: {
                Args: { p_order_id: string };
                Returns: boolean;
            };
            expire_pending_orders: {
                Args: Record<string, never>;
                Returns: number;
            };
            update_order_status: {
                Args: { p_order_id: string; p_next_status: string };
                Returns: Database["public"]["Tables"]["orders"]["Row"];
            };
        };
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
};
