import React from "react";
import Image from "@/components/ui/image";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";

const STEPS = [
    {
        no: "01",
        label: "Premium Fabric",
        caption: "The same quality shirting you’d expect from Raymond.",
        image: IMAGES.quality,
    },
    {
        no: "02",
        label: "A Different Buying Model",
        caption: "Sourced through the mill / surplus and cut-piece market.",
        image: IMAGES.showroom,
    },
    {
        no: "03",
        label: "A Better Price",
        caption: "Premium fabric, without the conventional retail markup.",
        image: IMAGES.concept,
    },
];

const POINTS = [
    {
        title: "Premium fabric",
        text: "Quality fabrics sourced through the mill / surplus and cut-piece market.",
    },
    {
        title: "Less retail markup",
        text: "You’re buying without the layers of traditional retail pricing.",
    },
    {
        title: "2-piece cut-piece format",
        text: "Each set is 1.8 metres, pre-cut into 2 pieces — enough for one shirt.",
    },
    {
        title: "Better value",
        text: "You get the fabric you actually need without paying conventional retail pricing.",
    },
];

export default function WhyAffordable() {
    return (
        <section className="py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                {/* Heading + intro */}
                <div className="max-w-3xl">
                    <SectionHeading
                        eyebrow="Why So Affordable?"
                        title="Same idea of premium fabric. A very different price."
                    />
                    <p className="mt-7 text-lg text-foreground/75 leading-relaxed">
                        Ever wondered how Raymond fabric can be available at a price like
                        this? You’re not paying the usual retail markup.
                    </p>
                    <p className="mt-4 text-foreground/70 leading-relaxed">
                        Crazy Cut Piece works with mill / surplus and cut-piece fabric — an
                        opportunity to offer premium fabrics at much lower prices than
                        conventional retail. The fabric is not inferior or defective. It’s
                        simply bought differently.
                    </p>
                </div>

                {/* Visual story: Premium Fabric → Different Buying Model → Better Price */}
                <div className="mt-14 grid gap-6 sm:gap-8 sm:grid-cols-3">
                    {STEPS.map((s) => (
                        <div key={s.no} className="flex flex-col">
                            <div className="swatch-shadow rounded-sm overflow-hidden bg-secondary">
                                <Image
                                    src={s.image}
                                    alt={`${s.label} — Raymond shirt fabric`}
                                    fittingType="fill"
                                    className="w-full aspect-[4/5] object-cover transition-transform duration-[1.2s] ease-out hover:scale-105"
                                />
                            </div>
                            <div className="mt-5 flex items-baseline gap-3">
                                <span className="font-display text-2xl text-accent">{s.no}</span>
                                <h3 className="font-display text-2xl font-medium text-foreground">
                                    {s.label}
                                </h3>
                            </div>
                            <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                                {s.caption}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Smart buying. Not compromise. */}
                <div className="mt-20 grid gap-10 lg:gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
                            Smart buying.
                        </span>
                        <h3 className="mt-4 font-display text-3xl sm:text-4xl font-medium text-foreground">
                            Not compromise.
                        </h3>
                        <div className="brass-rule w-20 mt-6" />
                    </div>
                    <div className="lg:col-span-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                        {POINTS.map((p) => (
                            <div key={p.title} className="border-l border-accent/40 pl-5">
                                <h4 className="font-display text-xl font-medium text-foreground">
                                    {p.title}
                                </h4>
                                <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                                    {p.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}