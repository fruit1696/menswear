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
            { id: "white-classic", name: "Raymond Classic White", price: "₹460/2-piece", image: "/pic3.jpeg", ...sharedDetails },
            { id: "white-textured", name: "Raymond Textured White", price: "₹500/2-piece", image: "/pic4.jpeg", ...sharedDetails },
            { id: "white-premium", name: "Raymond Premium Ivory", price: "₹520/2-piece", image: "/pic5.jpeg", ...sharedDetails },
            { id: "white-linen", name: "Raymond White Linen", price: "₹560/2-piece", image: "/pic2.jpeg", ...sharedDetails },
        ],
    },
    blue: {
        id: "blue",
        name: "Blue Collection",
        description: "Browse versatile sky, navy, azure, and statement blue Raymond shirting fabrics.",
        image: "/bluecollection.jpeg",
        varieties: [
            { id: "blue-sky", name: "Raymond Sky Blue", price: "₹460/2-piece", image: "/pic1.jpeg", ...sharedDetails },
            { id: "blue-navy", name: "Raymond Classic Navy", price: "₹500/2-piece", image: "/pic2.jpeg", ...sharedDetails },
            { id: "blue-azure", name: "Raymond Azure Cotton", price: "₹520/2-piece", image: "/pic4.jpeg", ...sharedDetails },
            { id: "blue-royal", name: "Raymond Royal Blue", price: "₹560/2-piece", image: "/pic5.jpeg", ...sharedDetails },
        ],
    },
};

export const FEATURED_COLLECTION_LIST = Object.values(FEATURED_COLLECTIONS);
