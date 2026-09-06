import React from "react";
import Image from "@/components/ui/image";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";

const PILLARS = [
    {
        title: "Our Story",
        text: "A family fabric business built on honest sourcing and a love of good shirting. Add your story here.",
    },
    {
        title: "Quality Promise",
        text: "Every cut piece is checked before it leaves us. If a fabric isn't right, it doesn't ship.",
    },
    {
        title: "Visit Us",
        text: "Find us in the textile heart of India. Walk in to feel the fabrics in person.",
    },
];

export default function Trust() {
    return (
        <section id="about" className="py-20 sm:py-32 bg-secondary/50 border-y border-border/60">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
                    <div className="lg:col-span-6">
                        <div className="swatch-shadow rounded-sm overflow-hidden">
                            <Image
                                src={IMAGES.showroom}
                                alt="Premium fabric showroom with rolls of Raymond shirting"
                                fittingType="fill"
                                className="w-full aspect-[3/2] object-cover"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-6">
                        <SectionHeading eyebrow="Why Trust Us" title="A Fabric Business, Not a Website." />
                        <div className="mt-10 space-y-8">
                            {PILLARS.map((p) => (
                                <div key={p.title} className="border-l border-accent/40 pl-5">
                                    <h3 className="font-display text-2xl font-medium text-foreground">{p.title}</h3>
                                    <p className="mt-2 text-foreground/65 leading-relaxed">{p.text}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-sm text-foreground/50">
                            Customer reviews, years of experience and certifications will be added here as they are provided.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}