export const queryKeys = {
    products: {
        all: ["products"] as const,
        list: () => ["products", "list"] as const,
        detail: (slug: string) => ["products", "detail", slug] as const,
    },
};
