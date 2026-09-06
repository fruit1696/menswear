import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { WhatsAppIcon } from "@/components/Navbar";
import { whatsappLink } from "@/lib/brand";

const FABRIC_OPTIONS = ["Cotton", "Linen", "Polyester", "Terry", "Other / Mix"];
const PATTERN_OPTIONS = ["Solid / Plain", "Checks", "Stripes", "Other"];

// Sophisticated, muted swatches — not generic bright UI colors.
const COLOR_OPTIONS = [
    { label: "White", hex: "#F4F1EA" },
    { label: "Black", hex: "#1B1B1B" },
    { label: "Navy Blue", hex: "#1F2A44" },
    { label: "Sky Blue", hex: "#8FB3D6" },
    { label: "Grey", hex: "#8A8D91" },
    { label: "Charcoal", hex: "#3A444E" },
    { label: "Red", hex: "#9B2D2A" },
    { label: "Burgundy", hex: "#5C1A1B" },
    { label: "Green", hex: "#3B5A3B" },
    { label: "Brown", hex: "#6F4E37" },
    { label: "Tan", hex: "#C8A878" },
    { label: "Yellow", hex: "#D3B04A" },
];
const OTHER_COLOR = "Other / Specific Shade";

const STEPS = [
    { n: 1, label: "Fabric" },
    { n: 2, label: "Color" },
    { n: 3, label: "Pattern" },
];

const transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };

function toggle(arr, value) {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function PickYourStyle() {
    const [step, setStep] = useState(1); // 1,2,3,4(summary)
    const [fabrics, setFabrics] = useState([]);
    const [colors, setColors] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [fabricNote, setFabricNote] = useState("");
    const [colorNote, setColorNote] = useState("");
    const [patternNote, setPatternNote] = useState("");

    const fabricOther = fabrics.includes("Other / Mix");
    const colorOther = colors.includes(OTHER_COLOR);
    const patternOther = patterns.includes("Other");

    const canNext = useMemo(() => {
        if (step === 1) return fabrics.length > 0;
        if (step === 2) return colors.length > 0;
        if (step === 3) return patterns.length > 0;
        return true;
    }, [step, fabrics, colors, patterns]);

    const message = useMemo(() => {
        const fabricList = fabrics
            .map((f) => (f === "Other / Mix" && fabricNote.trim() ? fabricNote.trim() : f))
            .join(", ");
        const colorList = colors
            .map((c) => (c === OTHER_COLOR && colorNote.trim() ? colorNote.trim() : c))
            .join(", ");
        const styleList = patterns
            .map((p) => (p === "Other" && patternNote.trim() ? patternNote.trim() : p))
            .join(", ");

        return (
            `Hi! Mujhe aapke website se exact ye combination chahiye:\n\n` +
            `- Fabric: ${fabricList || "—"}\n` +
            `- Color: ${colorList || "—"}\n` +
            `- Style: ${styleList || "—"}\n\n` +
            `Aapke paas aaj ke stock me iska exact ya nearest shade available hai? Photos share kar dijiye.`
        );
    }, [fabrics, colors, patterns, fabricNote, colorNote, patternNote]);

    return (
        <section id="pick-your-style" className="bg-secondary/40 py-20 sm:py-28">
            <div className="mx-auto max-w-3xl px-5 sm:px-8">
                <SectionHeading
                    eyebrow="Pick Your Style"
                    title="See It Before You Buy It"
                    align="center"
                />
                <p className="mt-5 text-center text-sm sm:text-base text-foreground/65 leading-relaxed max-w-xl mx-auto">
                    Looking for a specific fabric? Just share your preferred material, color, and pattern. Our experts will check our current selection and send you live photos of your perfect match over WhatsApp.
                </p>

                <div className="mt-12 bg-card border border-border rounded-sm p-6 sm:p-10 swatch-shadow">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10">
                        {STEPS.map((s, i) => {
                            const active = step === s.n;
                            const done = step > s.n || step === 4;

                            // Validation: Step 1 always accessible. Step 2 requires fabric. Step 3 requires color. Step 4 requires pattern.
                            const isStepAccessible =
                                s.n === 1 ||
                                (s.n === 2 && fabrics.length > 0) ||
                                (s.n === 3 && fabrics.length > 0 && colors.length > 0) ||
                                (s.n === 4 && fabrics.length > 0 && colors.length > 0 && patterns.length > 0);

                            return (
                                <React.Fragment key={s.n}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isStepAccessible) setStep(s.n);
                                        }}
                                        disabled={!isStepAccessible}
                                        className={`flex items-center gap-2 focus:outline-none transition-opacity duration-200 ${isStepAccessible
                                            ? "cursor-pointer group opacity-100"
                                            : "cursor-not-allowed opacity-40"
                                            }`}
                                        aria-label={`Go to step ${s.n}: ${s.label}`}
                                    >
                                        <span
                                            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all duration-300 ${isStepAccessible ? "group-hover:scale-105" : ""
                                                } ${active || done
                                                    ? "bg-foreground text-primary-foreground"
                                                    : "border border-border text-foreground/45 group-hover:border-foreground/70"
                                                }`}
                                        >
                                            {done ? <Check className="w-3.5 h-3.5" strokeWidth={2} /> : s.n}
                                        </span>
                                        <span
                                            className={`text-xs sm:text-sm uppercase tracking-[0.15em] transition-colors duration-300 ${isStepAccessible ? "group-hover:text-foreground" : ""
                                                } ${active ? "text-foreground font-semibold" : "text-foreground/45"}`}
                                        >
                                            {s.label}
                                        </span>
                                    </button>
                                    {i < STEPS.length - 1 && (
                                        <ChevronRight className="w-4 h-4 text-foreground/30" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <Step key="s1" heading="What fabric are you looking for?">
                                <div className="flex flex-wrap gap-3">
                                    {FABRIC_OPTIONS.map((f) => (
                                        <Chip
                                            key={f}
                                            label={f}
                                            active={fabrics.includes(f)}
                                            onClick={() => setFabrics((a) => toggle(a, f))}
                                        />
                                    ))}
                                </div>
                                <AnimatePresence>
                                    {fabricOther && (
                                        <CustomInput
                                            key="fn"
                                            placeholder="e.g., Cotton blend, Wool mix"
                                            value={fabricNote}
                                            onChange={setFabricNote}
                                        />
                                    )}
                                </AnimatePresence>
                            </Step>
                        )}

                        {step === 2 && (
                            <Step key="s2" heading="What colors are you looking for?">
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {COLOR_OPTIONS.map((c) => (
                                        <Swatch
                                            key={c.label}
                                            label={c.label}
                                            hex={c.hex}
                                            active={colors.includes(c.label)}
                                            onClick={() => setColors((a) => toggle(a, c.label))}
                                        />
                                    ))}
                                </div>
                                <div className="mt-3">
                                    <Chip
                                        label={OTHER_COLOR}
                                        active={colorOther}
                                        onClick={() => setColors((a) => toggle(a, OTHER_COLOR))}
                                    />
                                </div>
                                <AnimatePresence>
                                    {colorOther && (
                                        <CustomInput
                                            key="cn"
                                            placeholder="Type your color name or shade (e.g., Powder Blue, Bottle Green)"
                                            value={colorNote}
                                            onChange={setColorNote}
                                        />
                                    )}
                                </AnimatePresence>
                            </Step>
                        )}

                        {step === 3 && (
                            <Step key="s3" heading="What pattern do you prefer?">
                                <div className="flex flex-wrap gap-3">
                                    {PATTERN_OPTIONS.map((p) => (
                                        <Chip
                                            key={p}
                                            label={p}
                                            active={patterns.includes(p)}
                                            onClick={() => setPatterns((a) => toggle(a, p))}
                                        />
                                    ))}
                                </div>
                                <AnimatePresence>
                                    {patternOther && (
                                        <CustomInput
                                            key="pn"
                                            placeholder="Tell us the pattern or style you're looking for"
                                            value={patternNote}
                                            onChange={setPatternNote}
                                        />
                                    )}
                                </AnimatePresence>
                            </Step>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={transition}
                            >
                                <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground text-balance">
                                    Your fabric request
                                </h3>
                                <div className="brass-rule w-20 mt-4 mb-8" />
                                <div className="space-y-5">
                                    <SummaryRow
                                        label="Fabric"
                                        value={fabrics
                                            .map((f) =>
                                                f === "Other / Mix" && fabricNote.trim() ? fabricNote.trim() : f
                                            )
                                            .join(", ")}
                                        onEdit={() => setStep(1)}
                                    />
                                    <SummaryRow
                                        label="Color"
                                        value={colors
                                            .map((c) =>
                                                c === OTHER_COLOR && colorNote.trim() ? colorNote.trim() : c
                                            )
                                            .join(", ")}
                                        onEdit={() => setStep(2)}
                                    />
                                    <SummaryRow
                                        label="Style"
                                        value={patterns
                                            .map((p) =>
                                                p === "Other" && patternNote.trim() ? patternNote.trim() : p
                                            )
                                            .join(", ")}
                                        onEdit={() => setStep(3)}
                                    />
                                </div>

                                <div className="mt-10 text-center">
                                    <p className="text-xs uppercase tracking-[0.25em] text-accent mb-2">
                                        See It Before You Buy It
                                    </p>
                                    <p className="text-sm text-foreground/60 mb-6">
                                        Ask us what's available today.
                                    </p>
                                    <a
                                        href={whatsappLink(message)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-4 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm hover:bg-foreground/90 transition-colors duration-300"
                                    >
                                        <WhatsAppIcon className="w-4 h-4" />
                                        Chat on WhatsApp
                                        <ChevronRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step controls */}
                    {step < 4 && (
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/60">
                            <button
                                onClick={() => setStep((s) => Math.max(1, s - 1))}
                                disabled={step === 1}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground disabled:opacity-0 disabled:pointer-events-none transition-all duration-300"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                            <button
                                onClick={() => setStep((s) => Math.min(4, s + 1))}
                                disabled={!canNext}
                                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 bg-foreground text-primary-foreground text-sm font-medium tracking-wide rounded-sm hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-foreground transition-all duration-300"
                            >
                                {step === 3 ? "See Your Request" : "Next"}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function Step({ heading, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={transition}
        >
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground text-balance mb-7">
                {heading}
            </h3>
            {children}
        </motion.div>
    );
}

function Chip({ label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-sm border text-sm font-medium tracking-wide transition-all duration-300 ${active
                ? "bg-foreground text-primary-foreground border-foreground"
                : "bg-card text-foreground/80 border-border hover:border-foreground/50"
                }`}
        >
            {active && <Check className="w-4 h-4" strokeWidth={2} />}
            {label}
        </button>
    );
}

function Swatch({ label, hex, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group flex flex-col items-center gap-2 p-2.5 rounded-sm border transition-all duration-300 ${active
                ? "border-foreground bg-foreground/5"
                : "border-border hover:border-foreground/50"
                }`}
        >
            <span
                className={`w-full aspect-square rounded-sm border ${active ? "ring-2 ring-foreground ring-offset-1 ring-offset-card" : "border-black/10"
                    }`}
                style={{ backgroundColor: hex }}
            />
            <span
                className={`text-[11px] sm:text-xs tracking-wide text-center leading-tight ${active ? "text-foreground font-medium" : "text-foreground/65"
                    }`}
            >
                {label}
            </span>
        </button>
    );
}

function CustomInput({ placeholder, value, onChange }) {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transition}
            className="overflow-hidden"
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="mt-4 w-full px-4 py-3 bg-background border border-border rounded-sm text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/70 transition-colors duration-300"
            />
        </motion.div>
    );
}

function SummaryRow({ label, value, onEdit }) {
    return (
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-border/50">
            <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-1">
                    {label}
                </p>
                <p className="text-base text-foreground">{value || "—"}</p>
            </div>
            <button
                onClick={onEdit}
                className="text-sm font-medium text-foreground/60 hover:text-foreground border-b border-accent pb-0.5 transition-colors duration-300"
            >
                Edit
            </button>
        </div>
    );
}