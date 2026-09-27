const sharedDetails = {
    originalPrice: 1500,
    deliveryLeadDays: 4,
};

export const FEATURED_COLLECTIONS = {
    white: {
        id: "white",
        name: "White Collection",
        description: "Explore crisp whites, soft ivories, and refined light-toned Raymond shirting fabrics.",
        image: "/whitecollection.jpeg",
        varieties: [
            { id: "white-classic", productId: "20000000-0000-4000-8000-000000000001", name: "Raymond Classic White", price: "₹460/2-piece", image: "/Awhite2.jpeg", images: ["/Awhite2.jpeg", "/Awhite1.jpeg", "/white1.jpeg"], ...sharedDetails },
            { id: "white-textured", productId: "20000000-0000-4000-8000-000000000002", name: "Raymond Textured White", price: "₹460/2-piece", image: "/white1.jpeg", images: ["/white1.jpeg", "/white2.jpeg", "/white3.jpeg"], ...sharedDetails },
            { id: "white-premium", productId: "20000000-0000-4000-8000-000000000003", name: "Raymond Premium Ivory", price: "₹460/2-piece", image: "/white2.jpeg", images: ["/white2.jpeg", "/white3.jpeg", "/Awhite2.jpeg"], ...sharedDetails },
            { id: "white-linen", productId: "20000000-0000-4000-8000-000000000004", name: "Raymond White Linen", price: "₹460/2-piece", image: "/white1.jpeg", images: ["/white1.jpeg", "/Awhite1.jpeg", "/white2.jpeg"], ...sharedDetails },
        ],
    },
    blue: {
        id: "blue",
        name: "Blue Collection",
        description: "Browse versatile sky, navy, azure, and statement blue Raymond shirting fabrics.",
        image: "/bluecollection.jpeg",
        varieties: [
            { id: "blue-sky", productId: "20000000-0000-4000-8000-000000000005", name: "Raymond Sky Blue", price: "₹460/2-piece", image: "/blue1.jpeg", images: ["/blue1.jpeg", "/blue2.jpeg", "/blue3.jpeg"], ...sharedDetails },
            { id: "blue-navy", productId: "20000000-0000-4000-8000-000000000006", name: "Raymond Classic Navy", price: "₹500/2-piece", image: "/blue2.jpeg", images: ["/blue2.jpeg", "/blue3.jpeg", "/blue1.jpeg"], ...sharedDetails },
            { id: "blue-azure", productId: "20000000-0000-4000-8000-000000000007", name: "Raymond Azure Cotton", price: "₹520/2-piece", image: "/blue3.jpeg", images: ["/blue3.jpeg", "/blue1.jpeg", "/blue2.jpeg"], ...sharedDetails },
            { id: "blue-royal", productId: "20000000-0000-4000-8000-000000000008", name: "Raymond Royal Blue", price: "₹560/2-piece", image: "/blue1.jpeg", images: ["/blue1.jpeg", "/blue3.jpeg", "/blue2.jpeg"], ...sharedDetails },
        ],
    },
};

export const FEATURED_COLLECTION_LIST = Object.values(FEATURED_COLLECTIONS);

export const FULL_COLLECTION = {
    id: "all",
    name: "Full Collection",
    description: "Browse all available varieties from our White and Blue Raymond fabric collections in one place.",
    varieties: FEATURED_COLLECTION_LIST.flatMap((collection) => collection.varieties),
};
