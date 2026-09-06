import React from "react";
import Image from "@/components/ui/image";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";
import TranslateText from "@/components/TranslateText";

export default function TwoPieceConcept() {
    return (
        <section id="concept" className="py-20 sm:py-32 bg-secondary/50 border-y border-border/60">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <SectionHeading
                        eyebrow="The Concept"
                        title="What Is a 2-Piece Cut Piece?"
                        align="center"
                    />
                    <TranslateText
                        english="Premium Raymond shirt fabric, pre-cut with the right amount of fabric needed to make one complete men's shirt. Each set comes as two pre-cut pieces that together provide enough fabric to take straight to your tailor."
                        hindi="प्रीमियम रेमंड शर्ट फैब्रिक, एक पूरी शर्ट बनाने के लिए सही मात्रा में पहले से कटा हुआ। प्रत्येक सेट में दो कट पीस होते हैं जो मिलकर एक पुरुष की शर्ट सिलाने के लिए पर्याप्त फैब्रिक प्रदान करते हैं।"
                        className="mt-7 text-lg text-foreground/75 leading-relaxed text-center block"
                    />
                </div>

                {/* Visual flow */}
                <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
                    <div className="lg:col-span-5">
                        <div className="relative swatch-shadow rounded-sm overflow-hidden bg-background">
                            <Image
                                src={IMAGES.concept}
                                alt="Two folded pieces of Raymond shirt fabric with tailor's shears"
                                fittingType="fill"
                                className="w-full aspect-[3/2] object-cover"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-7 text-center">
                        <div className="grid gap-4 sm:gap-6 grid-cols-2">
                            <PieceCard
                                step="Piece 1"
                                use="Front & Back"
                                detail="The body of the shirt - front panels and back."
                            />
                            <PieceCard
                                step="Piece 2"
                                use="Sleeves & Collar"
                                detail="Sleeves, collar and cuffs - the finishing pieces."
                            />
                        </div>

                        <div className="mt-6 grid gap-2 sm:gap-4 grid-cols-3">
                            <PieceCard
                                step="Total Length"
                                use="≈ 1.8 metre"
                                detail=""//Full cut piece length
                            />
                            <PieceCard
                                step="Width"
                                use="57 inch"
                                detail=""//Standard fabric width
                            />
                            <PieceCard
                                step="Makes"
                                use="1 Shirt"
                                detail=""//Enough for one complete shirt
                            />
                        </div>

                        {/* <div className="mt-6 p-6 bg-background border border-border/60 rounded-sm">
                            <p className="text-sm text-foreground/65 leading-relaxed text-center">
                                2-piece cut piece ≈ 1.8 metre length × 57 inch width — enough for one
                                complete shirt.
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}

function PieceCard({ step, use, detail }) {
    return (
        <div className="p-6 bg-background border border-border/60 rounded-sm">
            <span className="text-[11px] uppercase tracking-[0.25em] text-accent">{step}</span>
            <h3 className="mt-3 font-display text-2xl font-medium text-foreground">{use}</h3>
            <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{detail}</p>
        </div>
    );
}

function Spec({ label, value }) {
    return (
        <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">{label}</p>
            <p className="mt-1 font-display text-xl text-foreground">{value}</p>
        </div>
    );
}