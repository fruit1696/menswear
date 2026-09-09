import React from "react";
import { whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Navbar";

export default function PrivacyPolicy() {
    return (
        <div className="bg-background min-h-screen py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-5 sm:px-8">
                <div className="border-b border-border pb-8 mb-10">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">
                        Crazy Cutpiece Policies
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-muted-foreground mt-3">
                        Last updated: September 2026
                    </p>
                </div>

                <div className="space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
                    <section>
                        <p className="text-muted-foreground">
                            Crazy Cutpiece respects your privacy and is committed to protecting the information you share with us.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            This Privacy Policy explains what information we may collect, how we use it, and how we protect it when you use our website or contact us to place an order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Information We May Collect</h2>
                        <p className="text-muted-foreground mb-2">
                            Depending on how you use our website and place an order, we may collect information such as:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Your name</li>
                            <li>Phone number</li>
                            <li>WhatsApp number</li>
                            <li>Shipping address</li>
                            <li>City, state, and postal code</li>
                            <li>Order and product information</li>
                            <li>Information you provide when communicating with us</li>
                            <li>Any other information you voluntarily provide to us</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">How We Use Your Information</h2>
                        <p className="text-muted-foreground mb-2">
                            We may use your information to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Respond to your questions and WhatsApp messages</li>
                            <li>Confirm and process your orders</li>
                            <li>Arrange shipping and delivery</li>
                            <li>Share tracking information</li>
                            <li>Contact you regarding your order</li>
                            <li>Resolve order, shipping, or product-related issues</li>
                            <li>Improve our website, products, and customer experience</li>
                            <li>Prevent fraudulent or unauthorized activity</li>
                            <li>Comply with applicable legal requirements</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Payments</h2>
                        <p className="text-muted-foreground">
                            Crazy Cutpiece does not currently process payments directly through an online payment gateway on this website.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Customers communicate with the owner through WhatsApp to confirm their order and payment arrangements.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            We do not ask customers to enter card or banking information into the Crazy Cutpiece website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Sharing Your Information</h2>
                        <p className="text-muted-foreground">
                            We may share necessary customer information with service providers involved in fulfilling your order, such as shipping or delivery providers.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            For example, your name, phone number, and delivery address may need to be provided to the shipping carrier so that your order can be delivered.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">WhatsApp Communication</h2>
                        <p className="text-muted-foreground">
                            When you contact Crazy Cutpiece through WhatsApp, your communication is also subject to WhatsApp&apos;s own privacy policies and terms.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            We may use the information you provide through WhatsApp to communicate with you about your order, payment confirmation, shipping, tracking, and customer support.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Data Security</h2>
                        <p className="text-muted-foreground">
                            We take reasonable steps to protect the information we collect from unauthorized access, misuse, alteration, or disclosure.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            However, no website or electronic communication system can be guaranteed to be completely secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-3">Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground">
                            We may update this Privacy Policy from time to time to reflect changes to our business, website, or legal requirements.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Any updated version will be posted on this page.
                        </p>
                    </section>

                    <section className="bg-secondary/40 p-6 rounded-lg border border-border mt-10">
                        <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            If you have questions about this Privacy Policy or how your information is handled, please contact Crazy Cutpiece through WhatsApp.
                        </p>
                        <a
                            href={whatsappLink("Hi Crazy Cutpiece, I have a question regarding your Privacy Policy.")}
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
