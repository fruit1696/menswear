import React from "react";
import SectionHeading from "@/components/SectionHeading";

const STEPS = [
    { no: "01", title: "Explore", text: "Browse a few selected fabrics online." },
    { no: "02", title: "WhatsApp", text: "Tell us what kind of fabric you're looking for." },
    { no: "03", title: "Discover More", text: "We'll show you actual photos of available fabrics." },
    { no: "04", title: "Choose", text: "Pick the fabric you like." },
    { no: "05", title: "Order", text: "Complete your purchase directly with us." },
];

export default function HowItWorks() {
    return (
        <section className="py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <SectionHeading eyebrow="How It Works" title="From Browse to Your Fabric." />

                <div className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-5 border border-border/60 rounded-sm overflow-hidden bg-border/60">
                    {STEPS.map((s) => (
                        <div key={s.no} className="bg-background p-7 flex flex-col gap-3 min-h-[180px]">
                            <span className="font-display text-3xl text-accent">{s.no}</span>
                            <h3 className="font-display text-xl font-medium text-foreground">{s.title}</h3>
                            <p className="text-sm text-foreground/65 leading-relaxed">{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}