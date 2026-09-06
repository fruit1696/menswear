// Central brand configuration for Crazy Cut Piece.
// Update the WhatsApp number and fabric entries here — the whole site updates.

export const BRAND = {
    name: "Crazy Cut Piece",
    tagline: "Raymond Shirt Fabrics — Sold as 2-Piece Cut Pieces",
    // Indian WhatsApp number in international format, digits only.
    whatsappNumber: "919876543210",
    location: "Surat, Gujarat, India",
    email: "hello@crazycutpiece.in",
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
        name: "Raymond Linen",

        image: "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/cebf068d3_generated_5cdb9ece.jpg",
        images: [
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/cebf068d3_generated_5cdb9ece.jpg",
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/70b8b124d_generated_image.png",
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/a9e31c4fc_generated_image.png",
        ],
        description:
            "Classic white",
        tone: "Cool · Breathable",
    },
    {
        id: "ivory-herringbone",
        name: "Raymond Ivory",

        image: "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/7650f6f30_generated_662466a4.jpg",
        images: [
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/7650f6f30_generated_662466a4.jpg",
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/05a178efc_generated_image.png",
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/294b99b6c_generated_image.png",
        ],
        description:
            "A crisp",
        tone: "Formal · Crisp",
    },
    {
        id: "slate-evening",
        name: "Raymond Slate",

        image: "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/41c004bca_generated_ca91bbdf.jpg",
        images: [
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/41c004bca_generated_ca91bbdf.jpg",
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/fb8616239_generated_image.png",
            "https://media.base44.com/images/public/6a971e2701a060b2f50a33ae/59291a4d3_generated_image.png",
        ],
        description:
            "A muted",
        tone: "Evening · Textured",
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