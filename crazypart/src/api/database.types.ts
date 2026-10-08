export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    display_name: string | null;
                    full_name: string | null;
                    phone: string | null;
                    role: "customer" | "admin";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    display_name?: string | null;
                    full_name?: string | null;
                    phone?: string | null;
                    role?: "customer" | "admin";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
                Relationships: [];
            };
            product_types: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["product_types"]["Insert"]>;
                Relationships: [];
            };
            products: {
                Row: {
                    id: string;
                    product_type_id: string | null;
                    name: string;
                    slug: string;
                    description: string;
                    price: number | null;
                    price_paise: number;
                    compare_at_price_paise: number | null;
                    delivery_lead_days: number | null;
                    sku: string;
                    category: string | null;
                    fabric_type: string | null;
                    color: string | null;
                    pattern: string | null;
                    status: "draft" | "active" | "archived" | "inactive" | "discontinued";
                    featured: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    product_type_id?: string | null;
                    name: string;
                    slug: string;
                    description?: string;
                    price?: number | null;
                    price_paise: number;
                    compare_at_price_paise?: number | null;
                    delivery_lead_days?: number | null;
                    sku: string;
                    category?: string | null;
                    fabric_type?: string | null;
                    color?: string | null;
                    pattern?: string | null;
                    status?: "draft" | "active" | "archived" | "inactive" | "discontinued";
                    featured?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "products_product_type_id_fkey";
                        columns: ["product_type_id"];
                        isOneToOne: false;
                        referencedRelation: "product_types";
                        referencedColumns: ["id"];
                    },
                ];
            };
            fabrics: {
                Row: {
                    product_id: string;
                    fabric_type: string;
                    color: string;
                    color_family: string;
                    pattern: string;
                    weight: string;
                    width_inches: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    product_id: string;
                    fabric_type: string;
                    color: string;
                    color_family: string;
                    pattern: string;
                    weight?: string;
                    width_inches?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["fabrics"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "fabrics_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: true;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
            };
            boxers: {
                Row: {
                    product_id: string;
                    size: string | null;
                    color: string | null;
                    material: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    product_id: string;
                    size?: string | null;
                    color?: string | null;
                    material?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["boxers"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "boxers_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: true;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
            };
            product_images: {
                Row: {
                    id: string;
                    product_id: string;
                    object_path: string;
                    image_url: string | null;
                    alt_text: string;
                    sort_order: number;
                    display_order: number;
                    is_primary: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    object_path: string;
                    image_url?: string | null;
                    alt_text?: string;
                    sort_order?: number;
                    display_order?: number;
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
                Relationships: [
                    {
                        foreignKeyName: "inventory_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: true;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
            };
            inventory_reservations: {
                Row: {
                    id: string;
                    product_id: string;
                    quantity: number;
                    user_id: string | null;
                    expires_at: string;
                    status: "active" | "confirmed" | "expired" | "cancelled";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    quantity: number;
                    user_id?: string | null;
                    expires_at: string;
                    status?: "active" | "confirmed" | "expired" | "cancelled";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["inventory_reservations"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "inventory_reservations_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "inventory_reservations_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "wishlists_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wishlists_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "carts_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: true;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "cart_items_cart_id_fkey";
                        columns: ["cart_id"];
                        isOneToOne: false;
                        referencedRelation: "carts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "cart_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
            };
            orders: {
                Row: {
                    id: string;
                    order_number: string;
                    user_id: string;
                    status: "pending_payment" | "paid" | "payment_failed" | "cancelled" | "processing" | "shipped" | "delivered" | "refunded";
                    subtotal: number | null;
                    shipping_fee: number;
                    discount: number;
                    total_amount: number | null;
                    subtotal_paise: number;
                    shipping_paise: number;
                    total_paise: number;
                    currency: "INR";
                    shipping_full_name: string | null;
                    shipping_phone: string | null;
                    shipping_address_line1: string | null;
                    shipping_address_line2: string | null;
                    shipping_city: string | null;
                    shipping_state: string | null;
                    shipping_postal_code: string | null;
                    shipping_country: string | null;
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
                Relationships: [
                    {
                        foreignKeyName: "orders_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
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
                    unit_price: number | null;
                    unit_price_paise: number;
                    quantity: number;
                    line_total: number | null;
                    line_total_paise: number;
                    image_url: string | null;
                };
                Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]> & { order_id: string; product_name: string; sku: string; unit_price_paise: number; quantity: number; line_total_paise: number };
                Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
            };
            payments: {
                Row: {
                    id: string;
                    order_id: string;
                    provider: "razorpay" | "stripe" | "other";
                    idempotency_key: string | null;
                    provider_order_id: string | null;
                    provider_payment_id: string | null;
                    razorpay_order_id: string;
                    razorpay_payment_id: string | null;
                    webhook_event_id: string | null;
                    payment_method: string | null;
                    amount: number | null;
                    amount_paise: number;
                    currency: "INR";
                    status: "created" | "authorized" | "captured" | "failed" | "refunded";
                    failure_reason: string | null;
                    provider_signature: string | null;
                    paid_at: string | null;
                    verified_at: string | null;
                    metadata: Json | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]> & { order_id: string };
                Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "payments_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    },
                ];
            };
            returns: {
                Row: {
                    id: string;
                    order_id: string;
                    user_id: string;
                    status: "requested" | "approved" | "rejected" | "received" | "completed";
                    reason: string;
                    notes: string | null;
                    requested_at: string;
                    received_at: string | null;
                    completed_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    user_id: string;
                    status?: "requested" | "approved" | "rejected" | "received" | "completed";
                    reason: string;
                    notes?: string | null;
                    requested_at?: string;
                    received_at?: string | null;
                    completed_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["returns"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "returns_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "returns_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
            };
            return_items: {
                Row: {
                    id: string;
                    return_id: string;
                    order_item_id: string;
                    quantity: number;
                    condition: string | null;
                    inspection_notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    return_id: string;
                    order_item_id: string;
                    quantity: number;
                    condition?: string | null;
                    inspection_notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["return_items"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "return_items_return_id_fkey";
                        columns: ["return_id"];
                        isOneToOne: false;
                        referencedRelation: "returns";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "return_items_order_item_id_fkey";
                        columns: ["order_item_id"];
                        isOneToOne: false;
                        referencedRelation: "order_items";
                        referencedColumns: ["id"];
                    },
                ];
            };
            refunds: {
                Row: {
                    id: string;
                    payment_id: string;
                    order_id: string;
                    return_id: string | null;
                    amount: number;
                    status: "initiated" | "processed" | "failed";
                    provider_refund_id: string | null;
                    reason: string | null;
                    created_at: string;
                    processed_at: string | null;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    payment_id: string;
                    order_id: string;
                    return_id?: string | null;
                    amount: number;
                    status?: "initiated" | "processed" | "failed";
                    provider_refund_id?: string | null;
                    reason?: string | null;
                    created_at?: string;
                    processed_at?: string | null;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["refunds"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "refunds_payment_id_fkey";
                        columns: ["payment_id"];
                        isOneToOne: false;
                        referencedRelation: "payments";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "refunds_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "refunds_return_id_fkey";
                        columns: ["return_id"];
                        isOneToOne: false;
                        referencedRelation: "returns";
                        referencedColumns: ["id"];
                    },
                ];
            };
            addresses: {
                Row: {
                    id: string;
                    user_id: string;
                    full_name: string | null;
                    recipient_name: string;
                    phone: string;
                    address_line1: string | null;
                    address_line2: string | null;
                    line1: string;
                    line2: string | null;
                    city: string;
                    state: string;
                    postal_code: string;
                    country: string | null;
                    country_code: string;
                    is_default: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    full_name?: string | null;
                    recipient_name: string;
                    phone: string;
                    address_line1?: string | null;
                    address_line2?: string | null;
                    line1: string;
                    line2?: string | null;
                    city: string;
                    state: string;
                    postal_code: string;
                    country?: string | null;
                    country_code?: string;
                    is_default?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "addresses_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
            };
            reviews: {
                Row: {
                    id: string;
                    product_id: string;
                    user_id: string;
                    order_id: string;
                    author_name: string;
                    display_name: string | null;
                    title: string | null;
                    body: string | null;
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
                    display_name?: string | null;
                    title?: string | null;
                    body?: string | null;
                    rating: number;
                    review_text: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "reviews_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reviews_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reviews_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    },
                ];
            };
            explore_deposits: {
                Row: {
                    id: string;
                    user_id: string;
                    amount_paise: number;
                    currency: "INR";
                    status: "created" | "captured" | "failed" | "refunded";
                    razorpay_order_id: string;
                    razorpay_payment_id: string | null;
                    paid_at: string | null;
                    refunded_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Partial<Database["public"]["Tables"]["explore_deposits"]["Row"]> & { user_id: string; razorpay_order_id: string };
                Relationships: [
                    {
                        foreignKeyName: "explore_deposits_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
            };
            product_option_requests: {
                Row: {
                    id: string;
                    user_id: string;
                    product_id: string;
                    product_name: string;
                    product_image: string | null;
                    product_details: Json;
                    requested_color: string | null;
                    requested_pattern: string | null;
                    customer_note: string | null;
                    status: "new" | "checking" | "replied" | "closed";
                    admin_reply: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    product_id: string;
                    product_name: string;
                    product_image?: string | null;
                    product_details?: Json;
                    requested_color?: string | null;
                    requested_pattern?: string | null;
                    customer_note?: string | null;
                    status?: "new" | "checking" | "replied" | "closed";
                    admin_reply?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["product_option_requests"]["Insert"]>;
                Relationships: [
                    {
                        foreignKeyName: "product_option_requests_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "product_option_requests_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
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

