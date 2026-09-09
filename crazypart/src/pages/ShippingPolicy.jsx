import React from "react";
import { whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";

export default function ShippingPolicy() {
    return (
        <div className="bg-background min-h-screen py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-5 sm:px-8">
                <div className="border-b border-border pb-8 mb-10">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">
                        Crazy Cutpiece Policies
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
                        Shipping Policy
                    </h1>
                    <p className="text-sm text-muted-foreground mt-3">
                        Last updated: September 2026
                    </p>
                </div>

                <div className="space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
                    <section>
                        <p className="text-muted-foreground">
                            Crazy Cutpiece ships fabric orders after the order has been confirmed and payment has been received.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">How Your Order Works</h2>
                        <p className="text-muted-foreground mb-2">
                            Our ordering process is simple:
                        </p>
                        <ol className="list-decimal pl-5 space-y-1.5 text-muted-foreground">
                            <li>Browse the available fabrics on our website.</li>
                            <li>Contact us on WhatsApp to confirm your order.</li>
                            <li>The owner will confirm the product availability, quantity, total amount, and payment details with you.</li>
                            <li>Once payment is confirmed, your order will be prepared for dispatch.</li>
                            <li>After your order is shipped, the tracking ID will be shared with you through WhatsApp.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Processing &amp; Dispatch</h2>
                        <p className="text-muted-foreground">
                            Orders are normally prepared and dispatched after payment confirmation.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            The actual dispatch time may vary depending on product availability, order volume, weekends, holidays, or other circumstances.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            If there is any expected delay, we will communicate with you through WhatsApp.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Delivery</h2>
                        <p className="text-muted-foreground">
                            Delivery times depend on the shipping carrier, destination, weather, holidays, and other circumstances outside our control.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Once the package has been handed over to the shipping carrier, delivery is handled by the carrier.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Crazy Cutpiece is not responsible for delays caused by the shipping carrier, incorrect or incomplete delivery information provided by the customer, natural events, or other circumstances beyond our reasonable control.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Tracking</h2>
                        <p className="text-muted-foreground">
                            Once your order has been shipped, the tracking ID will be shared with you through WhatsApp.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            You can use the tracking information provided by us to follow the status of your shipment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Incorrect Address</h2>
                        <p className="text-muted-foreground">
                            Please make sure that the delivery address and contact information provided to us are correct before the order is shipped.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            If an order cannot be delivered because of an incorrect or incomplete address provided by the customer, additional shipping charges may apply for re-shipping.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Damaged Packages</h2>
                        <p className="text-muted-foreground">
                            If your package appears damaged when delivered, please take photographs or a video of the package and contact us on WhatsApp as soon as possible.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            For shipping-related questions or assistance with your order, please contact us through WhatsApp.
                        </p>
                    </section>

                    <section className="bg-secondary/40 p-6 rounded-lg border border-border mt-10">
                        <h3 className="font-semibold text-foreground mb-2">Have shipping questions?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Contact us on WhatsApp for tracking updates or shipping assistance.
                        </p>
                        <a
                            href={whatsappLink("Hi Crazy Cutpiece, I have a question about my shipping/order.")}
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
