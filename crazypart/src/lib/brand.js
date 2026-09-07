// Central brand configuration for Crazy Cut Piece.
// Update the WhatsApp number and fabric entries here — the whole site updates.

export const BRAND = {
    name: "Crazy Cut Piece",
    tagline: "Raymond Shirt Fabrics — Sold as 2-Piece Cut Pieces",
    // Indian WhatsApp number in international format, digits only.
    whatsappNumber: "919425333460",
    location: "Surat, Gujarat, India",
    email: "[EMAIL_ADDRESS]",
    hours: "Mon – Sat · 10:00 AM – 7:00 PM IST",
};

// Build a WhatsApp deep link with a pre-filled, contextual message.
export function whatsappLink(message) {
    const text = encodeURIComponent(message || "Hi Crazy Cut Piece, I'd like to see more shirt fabric designs.");
    return `https://wa.me/${BRAND.whatsappNumber}?text=${text}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
    "Hi Crazy Cut Piece, I'd like to see more shirt fabric designs.";

// A small, curated selection. Add more here to extend the gallery.
export const FABRICS = [
    {
        id: "azure-linen",
        name: "Raymond 100% Cotton",
        price: "₹460",

        image: "/blue1.jpeg",
        images: [
            "/blue1.jpeg",
            "/blue2.jpeg",
            "/blue3.jpeg",
        ],
    },
    {
        id: "ivory-herringbone",
        name: "Raymond Giza Cotton",
        price: "₹500",

        image: "/black1.jpeg",
        images: [
            "/black1.jpeg",
            "/black2.jpeg",
        ],
    },
    {
        id: "slate-evening",
        name: "Raymond Pure white",
        price: "₹460",

        image: "/white1.jpeg",
        images: [
            "/white1.jpeg",
            "/white2.jpeg",
            "/white3.jpeg",
        ],
    },
    {
        id: "vibrant-collection",
        name: "Raymond",
        price: "₹400 – ₹1,500",

        image: "/colored.jpeg",
        images: [
            "/colored.jpeg",
            "/colored2.jpeg",
        ],
    },
];

// Resolve a fabric's image list, falling back to its single `image` field.
export function fabricImages(fabric) {
    if (fabric.images && fabric.images.length) return fabric.images;
    return fabric.image ? [fabric.image] : [];
}

export function fabricWhatsappLink(fabric) {
    const msg = `Hi Crazy Cut Piece, I'm interested in the ${fabric.name} (${fabric.code}) fabric. Can you show me similar available designs?`;
    return whatsappLink(msg);
}