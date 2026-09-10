// Central brand configuration for Crazy Cutpiece.
// Update the WhatsApp number and fabric entries here — the whole site updates.

export const BRAND = {
    name: "Crazy Cutpiece",
    tagline: "Raymond Shirt Fabrics — Sold as 2-Piece Cutpieces",
    // Indian WhatsApp number in international format, digits only.
    whatsappNumber: "919425333460",
    location: "Khargone, Madhya Pradesh, India",
    email: "[EMAIL_ADDRESS]",
    hours: "Mon – Sat · 10:00 AM – 8:00 PM IST",
    socials: {
        instagram: "https://www.instagram.com/crazycutpiece/",
        facebook: "#",
        whatsapp: "https://wa.me/919425333460",
    },
};

// Build a WhatsApp deep link with a pre-filled, contextual message.
export function whatsappLink(message) {
    const text = encodeURIComponent(message || "Hi Crazy Cutpiece, I'd like to see more shirt fabric designs.");
    return `https://wa.me/${BRAND.whatsappNumber}?text=${text}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
    "Hi Crazy Cutpiece, I'd like to see more shirt fabric designs.";

// A small, curated selection. Add more here to extend the gallery.
export const FABRICS = [
    {
        id: "azure-linen",
        productId: "10000000-0000-4000-8000-000000000001",
        name: "Raymond 100% Cotton",
        price: "₹460/2-piece",

        image: "/blue1.jpeg",
        images: [
            "/blue1.jpeg",
            "/blue2.jpeg",
            "/blue3.jpeg",
        ],
    },
    {
        id: "ivory-herringbone",
        productId: "10000000-0000-4000-8000-000000000002",
        name: "Raymond Giza Cotton",
        price: "₹500/2-piece",

        image: "/black1.jpeg",
        images: [
            "/black1.jpeg",
            "/black2.jpeg",
        ],
    },
    {
        id: "slate-evening",
        productId: "10000000-0000-4000-8000-000000000003",
        name: "Raymond Pure white",
        price: "₹460/2-piece",

        image: "/white1.jpeg",
        images: [
            "/white1.jpeg",
            "/white2.jpeg",
            "/white3.jpeg",
        ],
    },
    {
        id: "vibrant-collection",
        productId: "10000000-0000-4000-8000-000000000004",
        name: "Raymond Pure white",
        price: "₹460/2-piece",

        image: "/Awhite2.jpeg",
        images: [
            "/Awhite2.jpeg",
            "/Awhite1.jpeg",
        ],
    },
];

// Resolve a fabric's image list, falling back to its single `image` field.
export function fabricImages(fabric) {
    if (fabric.images && fabric.images.length) return fabric.images;
    return fabric.image ? [fabric.image] : [];
}

export function fabricWhatsappLink(fabric) {
    const msg = `Hi Crazy Cutpiece, I'm interested in the ${fabric.name} (${fabric.code}) fabric. Can you show me similar available designs?`;
    return whatsappLink(msg);
}
