import React from "react";
import { whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";

export default function RefundPolicy() {
    return (
        <div className="bg-background min-h-screen py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-5 sm:px-8">
                <div className="border-b border-border pb-8 mb-10">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">
                        Crazy Cut Piece Policies
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
                        Refund Policy
                    </h1>
                    <p className="text-sm text-muted-foreground mt-3">
                        Last updated: September 2026
                    </p>
                </div>

                <div className="space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
                    <section>
                        <p className="text-muted-foreground">
                            At Crazy Cut Piece, we carefully check every fabric order before it is packed and shipped. Because our products are pre-cut fabric pieces, we have a few specific rules regarding returns, exchanges, and refunds.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Returns &amp; Exchanges</h2>
                        <p className="text-muted-foreground">
                            All Crazy Cut Piece products are pre-cut fabric pieces. Once an order has been confirmed and payment has been made, cancellation or return may not be possible.
                        </p>
                        <p className="text-muted-foreground mt-3">
                            If you receive:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                            <li>The wrong fabric or product</li>
                            <li>A different quantity than what was confirmed</li>
                            <li>Fabric that is damaged or defective before shipping</li>
                        </ul>
                        <p className="text-muted-foreground mt-3">
                            please contact us on WhatsApp as soon as possible after receiving your order.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            For damaged or incorrect orders, we may ask you to provide clear photographs or a video of the package and fabric so that we can verify the issue.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Change of Mind</h2>
                        <p className="text-muted-foreground">
                            Because our fabrics are pre-cut specifically for sale, we generally do not accept returns simply because you have changed your mind, selected the wrong fabric, or no longer want the product.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Refunds</h2>
                        <p className="text-muted-foreground">
                            If Crazy Cut Piece determines that you are eligible for a refund, the refund amount and payment method will be discussed with you directly on WhatsApp.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Since payments are handled directly with the owner rather than through an online payment gateway on our website, refund processing will also be coordinated directly with the customer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Important</h2>
                        <p className="text-muted-foreground">
                            Please inspect your package and fabric as soon as you receive it. Any issue with the product should be reported promptly so that we can investigate and resolve it.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            For any questions regarding returns, exchanges, or refunds, please contact us through WhatsApp.
                        </p>
                    </section>

                    <section className="bg-secondary/40 p-6 rounded-lg border border-border mt-10">
                        <h3 className="font-semibold text-foreground mb-2">Have questions about returns or refunds?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Contact us on WhatsApp to discuss your order with us directly.
                        </p>
                        <a
                            href={whatsappLink("Hi Crazy Cut Piece, I have a question regarding returns/refunds.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded transition-colors"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            Contact Support on WhatsApp
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}
