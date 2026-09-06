import React from "react";
import Image from "@/components/ui/image";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";

const QUALITIES = [
    { title: "Texture", text: "A weave you can feel before you can see — the first sign of good fabric." },
    { title: "Weave", text: "Tight, even interlacing that holds its shape and wears well over time." },
    { title: "Colour", text: "Deep, considered shades that stay true wash after wash." },
    { title: "Finish", text: "A smooth, refined surface that presses clean and drapes with ease." },
];

export default function Quality() {
    return (
        <section className="py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
                    <div className="lg:col-span-6 order-2 lg:order-1">
                        <div className="swatch-shadow rounded-sm overflow-hidden">
                            <Image
                                src={IMAGES.quality}
                                alt="Macro close-up of white cotton shirt fabric weave"
                                fittingType="fill"
                                className="w-full aspect-[4/3] object-cover"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-6 order-1 lg:order-2">
                        <SectionHeading eyebrow="The Quality" title="Feel the Difference." />
                        <p className="mt-7 text-lg text-foreground/75 leading-relaxed max-w-xl">
                            The fabric is the hero. Look closely — the weave, the way light
                            catches the thread, the softness that only good cotton carries.
                            This is what a shirt is built on.
                        </p>
                        <div className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                            {QUALITIES.map((q) => (
                                <div key={q.title} className="border-l border-accent/40 pl-5">
                                    <h3 className="font-display text-xl font-medium text-foreground">{q.title}</h3>
                                    <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{q.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}