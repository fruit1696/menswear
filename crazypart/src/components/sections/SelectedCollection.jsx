import React from "react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import FabricCard from "@/components/FabricCard";
import { FABRICS } from "@/lib/brand";

export default function SelectedCollection() {
    return (
        <section id="fabrics" className="py-20 sm:py-32 bg-secondary/50 border-y border-border/60">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex flex-col items-center text-center gap-4">
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-foreground text-balance">
                        TOP PICKS
                    </h2>
                    <div className="brass-rule w-24 mx-auto" />
                </div>

                <div className="mt-14 grid gap-x-6 gap-y-10 grid-cols-2 lg:grid-cols-4">
                    {FABRICS.map((f, i) => (
                        <FabricCard key={f.id} fabric={f} index={i} />
                    ))}

                    {/* 4th Placeholder Card */}
                    <article className="group flex flex-col">
                        <div className="swatch-shadow rounded-sm overflow-hidden bg-secondary/40 aspect-[4/5] border border-dashed border-border flex flex-col items-center justify-center p-6 text-center text-foreground/40">
                            <span className="text-2xl font-light">+</span>
                            <span className="mt-2 text-xs uppercase tracking-widest font-medium text-foreground/60">
                                More Coming Soon
                            </span>
                            <span className="mt-1 text-[10px] text-foreground/40">
                                Slot Empty
                            </span>
                        </div>
                        <div className="mt-5 flex flex-col opacity-50">
                            <div className="h-5 w-32 bg-foreground/10 rounded animate-pulse" />
                            <div className="mt-2 h-3 w-20 bg-foreground/10 rounded animate-pulse" />
                        </div>
                    </article>
                </div>

            </div>
        </section>
    );
}