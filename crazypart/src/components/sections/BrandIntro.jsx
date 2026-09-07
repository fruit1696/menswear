import React from "react";
import SectionHeading from "@/components/SectionHeading";

export default function BrandIntro() {
    return (
        <section className="py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="grid gap-12 md:grid-cols-12 md:gap-16">
                    <div className="md:col-span-5">
                        <SectionHeading
                            eyebrow="The Brand"
                            title="Fabric That Makes the Shirt."
                        />
                    </div>
                    <div className="md:col-span-7 md:pt-4">
                        <div className="space-y-6 text-lg text-foreground/75 leading-relaxed max-w-2xl">
                            <p>
                                We work with Raymond — a name India has trusted for generations —
                                to bring you shirt fabrics chosen for their feel, their finish,
                                and the way they hold a crease from morning to night.
                            </p>
                            <p>
                                Every piece is selected, not stocked in bulk. We look at the weave,
                                the drape, and the colour, and we keep only what we would happily
                                wear ourselves. What you see online is a small, curated view of a
                                much larger collection.
                            </p>
                            <p className="text-foreground font-medium">
                                Honest fabric. Honest advice. A shirt worth wearing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}