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
            { id: "white-02", productId: "20000000-0000-4000-8000-000000000001", name: "Raymond White 02", price: "₹460/2-piece", image: "/white collection/02_geminiwhite_1.jpeg", images: ["/white collection/02_geminiwhite_1.jpeg"], ...sharedDetails },
            { id: "white-06", productId: "20000000-0000-4000-8000-000000000002", name: "Raymond White 06", price: "₹460/2-piece", image: "/white collection/06_geminiwhite_2.jpeg", images: ["/white collection/06_geminiwhite_2.jpeg"], ...sharedDetails },
            { id: "white-07", productId: "20000000-0000-4000-8000-000000000003", name: "Raymond White 07", price: "₹460/2-piece", image: "/white collection/07_geminiwhite_3.jpeg", images: ["/white collection/07_geminiwhite_3.jpeg"], ...sharedDetails },
            { id: "white-08", productId: "20000000-0000-4000-8000-000000000004", name: "Raymond White 08", price: "₹460/2-piece", image: "/white collection/08_geminiwhite_4.jpeg", images: ["/white collection/08_geminiwhite_4.jpeg"], ...sharedDetails },
            { id: "white-09", productId: "20000000-0000-4000-8000-000000000009", name: "Raymond White 09", price: "₹460/2-piece", image: "/white collection/09_geminiwhite_5.jpeg", images: ["/white collection/09_geminiwhite_5.jpeg"], ...sharedDetails },
            { id: "white-21", productId: "20000000-0000-4000-8000-000000000010", name: "Raymond White 21", price: "₹460/2-piece", image: "/white collection/21_geminiwhite_6.jpeg", images: ["/white collection/21_geminiwhite_6.jpeg"], ...sharedDetails },
            { id: "white-a2", productId: "20000000-0000-4000-8000-000000000011", name: "Raymond White A2", price: "₹460/2-piece", image: "/white collection/Awhite2.jpeg", images: ["/white collection/Awhite2.jpeg"], ...sharedDetails },
            { id: "white-1", productId: "20000000-0000-4000-8000-000000000012", name: "Raymond White 1", price: "₹460/2-piece", image: "/white collection/white1.jpeg", images: ["/white collection/white1.jpeg"], ...sharedDetails },
        ],
    },
    blue: {
        id: "blue",
        name: "Colored Collection",
        description: "Browse versatile colored Raymond shirting fabrics.",
        image: "/coloredcollection.jpeg",
        varieties: [
            { id: "colored-01", productId: "20000000-0000-4000-8000-000000000005", name: "Raymond Colored 01", price: "₹460/2-piece", image: "/colored collection/01.jpg.jpeg", images: ["/colored collection/01.jpg.jpeg"], ...sharedDetails },
            { id: "colored-05", productId: "20000000-0000-4000-8000-000000000006", name: "Raymond Colored 05", price: "₹500/2-piece", image: "/colored collection/05.jpg.jpeg", images: ["/colored collection/05.jpg.jpeg"], ...sharedDetails },
            { id: "colored-05-gemini", productId: "20000000-0000-4000-8000-000000000007", name: "Raymond Colored 05 Variant", price: "₹520/2-piece", image: "/colored collection/05geminicolors_02.jpeg", images: ["/colored collection/05geminicolors_02.jpeg"], ...sharedDetails },
            { id: "colored-10", productId: "20000000-0000-4000-8000-000000000008", name: "Raymond Colored 10", price: "₹560/2-piece", image: "/colored collection/10.jpg.jpeg", images: ["/colored collection/10.jpg.jpeg"], ...sharedDetails },
            { id: "colored-10-gemini", productId: "20000000-0000-4000-8000-000000000013", name: "Raymond Colored 10 Variant", price: "₹460/2-piece", image: "/colored collection/10_geminicolor_03.jpng.png", images: ["/colored collection/10_geminicolor_03.jpng.png"], ...sharedDetails },
            { id: "colored-11", productId: "20000000-0000-4000-8000-000000000014", name: "Raymond Colored 11", price: "₹460/2-piece", image: "/colored collection/11.jpg.jpeg", images: ["/colored collection/11.jpg.jpeg"], ...sharedDetails },
            { id: "colored-12", productId: "20000000-0000-4000-8000-000000000015", name: "Raymond Colored 12", price: "₹460/2-piece", image: "/colored collection/12.jpg.jpeg", images: ["/colored collection/12.jpg.jpeg"], ...sharedDetails },
            { id: "colored-15", productId: "20000000-0000-4000-8000-000000000016", name: "Raymond Colored 15", price: "₹460/2-piece", image: "/colored collection/15.jpg.jpeg", images: ["/colored collection/15.jpg.jpeg"], ...sharedDetails },
            { id: "colored-16", productId: "20000000-0000-4000-8000-000000000017", name: "Raymond Colored 16", price: "₹460/2-piece", image: "/colored collection/16.jpg.jpeg", images: ["/colored collection/16.jpg.jpeg"], ...sharedDetails },
            { id: "colored-17", productId: "20000000-0000-4000-8000-000000000018", name: "Raymond Colored 17", price: "₹460/2-piece", image: "/colored collection/17.jpg.jpeg", images: ["/colored collection/17.jpg.jpeg"], ...sharedDetails },
            { id: "colored-18", productId: "20000000-0000-4000-8000-000000000019", name: "Raymond Colored 18", price: "₹460/2-piece", image: "/colored collection/18.jpg.jpeg", images: ["/colored collection/18.jpg.jpeg"], ...sharedDetails },
            { id: "colored-black-2", productId: "20000000-0000-4000-8000-000000000020", name: "Raymond Black 2", price: "₹460/2-piece", image: "/colored collection/black2.jpeg", images: ["/colored collection/black2.jpeg"], ...sharedDetails },
            { id: "colored-blue-1", productId: "20000000-0000-4000-8000-000000000021", name: "Raymond Blue 1", price: "₹460/2-piece", image: "/colored collection/blue1.jpeg", images: ["/colored collection/blue1.jpeg"], ...sharedDetails },
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
