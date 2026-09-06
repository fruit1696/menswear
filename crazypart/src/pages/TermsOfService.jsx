import React from "react";
import { whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";

export default function TermsOfService() {
    return (
        <div className="bg-background min-h-screen py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-5 sm:px-8">
                <div className="border-b border-border pb-8 mb-10">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">
                        Crazy Cut Piece Policies
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-muted-foreground mt-3">
                        Last updated: September 2026
                    </p>
                </div>

                <div className="space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
                    <section>
                        <p className="text-muted-foreground font-medium text-foreground">
                            Welcome to Crazy Cut Piece.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            By accessing or using our website, you agree to these Terms of Service. Please read them carefully before using our website or placing an order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">About Our Products</h2>
                        <p className="text-muted-foreground">
                            Crazy Cut Piece sells fabric and pre-cut fabric pieces through its website.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Product images are provided to help customers understand the appearance of the fabric. Actual colors may appear slightly different depending on your device, screen settings, lighting, and other factors.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Product descriptions, measurements, colors, availability, and prices may change without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Product Availability</h2>
                        <p className="text-muted-foreground">
                            All products are subject to availability.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            A product displayed on the website may become unavailable before an order is confirmed.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            An order is considered confirmed only after the customer has communicated with the owner through WhatsApp and the product, quantity, price, delivery details, and payment arrangements have been confirmed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Orders &amp; Payment</h2>
                        <p className="text-muted-foreground">
                            Crazy Cut Piece does not currently process payments through an online payment gateway on the website.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Customers must contact the owner through WhatsApp to confirm their order and receive payment instructions.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            The owner will confirm the final order amount and payment details directly with the customer.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            An order will be prepared for shipping after payment has been confirmed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Order Cancellation</h2>
                        <p className="text-muted-foreground">
                            Because our products may be pre-cut and prepared specifically for an order, cancellation may not be possible after the order has been confirmed and payment has been received.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            If you need to cancel or modify an order, contact us on WhatsApp as soon as possible. We will let you know whether the requested change is possible.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Shipping</h2>
                        <p className="text-muted-foreground">
                            After an order has been confirmed and payment has been received, Crazy Cut Piece will prepare the order for dispatch.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Once the order has been shipped, the tracking ID will be shared with the customer through WhatsApp.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Delivery times may vary depending on the shipping carrier, destination, holidays, weather, and other circumstances outside our control.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Returns &amp; Refunds</h2>
                        <p className="text-muted-foreground">
                            Returns, exchanges, and refunds are governed by our Refund Policy.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Because our products are pre-cut fabric pieces, we may not accept returns simply because a customer has changed their mind or no longer wants the product.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            If you receive an incorrect or damaged product, contact us through WhatsApp as soon as possible after delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Website Use</h2>
                        <p className="text-muted-foreground">
                            You agree to use this website only for lawful purposes.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            You must not:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                            <li>Use the website for fraudulent or unlawful activities</li>
                            <li>Attempt to interfere with the operation or security of the website</li>
                            <li>Copy, reproduce, or misuse website content without permission</li>
                            <li>Attempt to gain unauthorized access to any part of the website</li>
                            <li>Submit false or misleading information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Intellectual Property</h2>
                        <p className="text-muted-foreground">
                            The content of the Crazy Cut Piece website, including text, photographs, graphics, logos, designs, product descriptions, and other materials, belongs to Crazy Cut Piece or its respective owners and may not be reproduced or used without permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            Crazy Cut Piece will make reasonable efforts to ensure that product information and website content are accurate.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            However, we cannot guarantee that the website will always be available, error-free, or completely accurate.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            We are not responsible for delays or failures caused by circumstances outside our reasonable control, including shipping carrier delays, natural events, technical failures, or incorrect information provided by customers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Changes to These Terms</h2>
                        <p className="text-muted-foreground">
                            We may update these Terms of Service from time to time.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            The updated version will be posted on this page and will become effective when published.
                        </p>
                    </section>

                    <section className="bg-secondary/40 p-6 rounded-lg border border-border mt-10">
                        <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            If you have questions about these Terms of Service, your order, or any of our policies, please contact Crazy Cut Piece through WhatsApp.
                        </p>
                        <a
                            href={whatsappLink("Hi Crazy Cut Piece, I have a question regarding the Terms of Service.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded transition-colors"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            Contact Us on WhatsApp
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}
