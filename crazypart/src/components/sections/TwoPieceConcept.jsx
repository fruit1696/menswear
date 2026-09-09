import React, { useState } from "react";
import Image from "@/components/ui/image";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";
import { Languages } from "lucide-react";

export default function TwoPieceConcept() {
    const [isHindi, setIsHindi] = useState(false);

    return (
        <section id="concept" className="scroll-mt-32 sm:scroll-mt-36 py-12 sm:py-16 bg-gradient-to-b from-background via-secondary/35 to-secondary/50">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <SectionHeading
                        eyebrow={isHindi ? "यह है क्या?" : "The Concept"}
                        title={isHindi ? "2-पीस क्या है?" : "What Is a 2-Piece?"}
                        align="center"
                    />
                    <p className="mt-7 text-lg text-foreground/75 leading-relaxed text-center block">
                        {isHindi
                            ? "यह प्रीमियम रेमंड शर्ट फैब्रिक है, जो एक पूरी शर्ट बनाने के लिए सही मात्रा में पहले से कटा हुआ आता है। प्रत्येक सेट में दो कट पीस होते हैं जो मिलकर एक पुरुष की शर्ट सिलाने के लिए पर्याप्त फैब्रिक प्रदान करते हैं।बस इसे सीधे अपने tailor के पास ले जाएँ और shirt सिलवा लें।"
                            : "Premium Raymond shirt fabric, pre-cut with the right amount of fabric needed to make one complete men's shirt. Each set comes as two pre-cutpieces that together provide enough fabric to take straight to your tailor."}
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsHindi((prev) => !prev)}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-foreground transition-colors duration-200 cursor-pointer focus:outline-none"
                        aria-label={isHindi ? "See English version" : "See Hindi translation"}
                    >
                        <Languages className="w-3.5 h-3.5" />
                        <span>{isHindi ? "See English" : "See Translation (हिंदी)"}</span>
                    </button>
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
                                step={isHindi ? "पीस 1" : "Piece 1"}
                                use={isHindi ? "फ्रंट और बैक" : "Front & Back"}
                                detail={isHindi ? "इस पीस से shirt का आगे और पीछे का हिस्सा तैयार होगा।" : "The body of the shirt - front and back."}
                            />
                            <PieceCard
                                step={isHindi ? "पीस 2" : "Piece 2"}
                                use={isHindi ? "स्लीव्स और कॉलर" : "Sleeves & Collar"}
                                detail={isHindi ? "इस पीस से shirt की स्लीव्स, कॉलर और कफ्स तैयार होंगे।" : "Sleeves, collar and cuffs - the finishing pieces."}
                            />
                        </div>

                        <div className="mt-6 grid gap-2 sm:gap-4 grid-cols-3">
                            <PieceCard
                                step={isHindi ? "कुल लंबाई" : "Total Length"}
                                use={isHindi ? "≈ 1.7मीटर" : "≈ 1.7 metre"}
                                detail=""
                            />
                            <PieceCard
                                step={isHindi ? "चौड़ाई" : "Width"}
                                use={isHindi ? "57 इंच" : "57 inch"}
                                detail=""
                            />
                            <PieceCard
                                step={isHindi ? "बनती है" : "Makes"}
                                use={isHindi ? "1 शर्ट" : "1 Shirt"}
                                detail=""
                            />
                        </div>
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
            {detail && <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{detail}</p>}
        </div>
    );
}