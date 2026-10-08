import React from "react";
import { Check, CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fabricImages } from "@/lib/brand";
import { useAuth } from "@/lib/AuthContext";
import { createProductOptionRequest } from "@/features/productRequests/productRequestService";

const COLORS = [
    ["White", "#FFFFFF"], ["Off White", "#F5F1E8"], ["Cream", "#FFF2CC"], ["Beige", "#D8C3A5"],
    ["Yellow", "#F5D547"], ["Orange", "#E97824"], ["Red", "#C62828"], ["Pink", "#E98AA5"],
    ["Maroon", "#741F35"], ["Purple", "#70408A"], ["Blue", "#2867B2"], ["Navy Blue", "#172A4D"],
    ["Sky Blue", "#79BCE8"], ["Green", "#397A46"], ["Olive", "#7A7B3F"], ["Teal", "#177C7A"],
    ["Brown", "#70452E"], ["Grey", "#858A91"], ["Black", "#171717"],
    ["Other", "conic-gradient(#C62828, #F5D547, #397A46, #2867B2, #70408A, #C62828)"],
];
const PATTERNS = ["Solid", "Checks", "Stripes", "Prints", "Textured", "Other"];

export default function ProductOptionRequest({ product }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const [color, setColor] = React.useState("");
    const [customColor, setCustomColor] = React.useState("");
    const [pattern, setPattern] = React.useState("");
    const [customPattern, setCustomPattern] = React.useState("");
    const [note, setNote] = React.useState("");
    const [saving, setSaving] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [error, setError] = React.useState("");
    const requestedColor = color === "Other" ? customColor.trim() : color;
    const requestedPattern = pattern === "Other" ? customPattern.trim() : pattern;
    const canSubmit = Boolean(requestedColor || requestedPattern);

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        if (!user) {
            navigate(`/login?returnTo=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
            return;
        }
        if (!canSubmit) {
            setError("Choose a color, a pattern, or both.");
            return;
        }
        setSaving(true);
        try {
            await createProductOptionRequest({
                user_id: user.id,
                product_id: product.productId,
                product_name: product.name,
                product_image: fabricImages(product)[0] ?? null,
                product_details: {
                    price: product.price ?? null,
                    code: product.code ?? null,
                    color: product.color ?? null,
                    pattern: product.pattern ?? null,
                    fabricType: product.fabricType ?? null,
                },
                requested_color: requestedColor || null,
                requested_pattern: requestedPattern || null,
                customer_note: note.trim() || null,
            });
            setSubmitted(true);
        } catch (submitError) {
            setError(submitError.message || "Unable to submit your request right now.");
        } finally {
            setSaving(false);
        }
    };

    return <section className="mt-6 border-t border-border/60 pt-6" aria-labelledby={`option-request-${product.id}`}>
        <h2 id={`option-request-${product.id}`} className="font-display text-2xl font-medium text-foreground">Looking for another color or pattern?</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">We may have more options available for this one.</p>
        <Button type="button" variant="outline" className="mt-4" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
            Request Another Option<ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
        {open && <div className="mt-5 rounded-lg border border-border/70 bg-white p-4 shadow-sm sm:p-6">
            {submitted ? <div role="status" className="py-4 text-center">
                <CheckCircle2 className="mx-auto h-9 w-9 text-accent" />
                <h3 className="mt-3 font-display text-2xl font-medium">Request submitted</h3>
                <p className="mt-2 text-sm text-foreground/60">We'll check our available collection and reply here.</p>
            </div> : <form onSubmit={submit}>
                <h3 className="font-display text-2xl font-medium text-foreground">What are you looking for?</h3>
                <fieldset className="mt-6">
                    <legend className="text-sm font-semibold text-foreground">Choose a color</legend>
                    <p className="mt-1 text-xs text-foreground/50">Optional if you choose a pattern.</p>
                    <div className="mt-4 grid grid-cols-5 gap-x-3 gap-y-4 sm:grid-cols-7" role="radiogroup" aria-label="Requested color">
                        {COLORS.map(([name, value]) => <button key={name} type="button" role="radio" aria-checked={color === name} title={name} onClick={() => setColor((current) => current === name ? "" : name)} className="group flex min-w-0 flex-col items-center gap-1.5 text-center">
                            <span className={`relative h-9 w-9 rounded-full border shadow-sm transition-all ${color === name ? "border-foreground ring-2 ring-accent ring-offset-2" : "border-black/15"}`} style={{ background: value }}>
                                {color === name && <span className="absolute inset-0 flex items-center justify-center"><Check className={`h-4 w-4 ${["White", "Off White", "Cream", "Yellow", "Beige", "Sky Blue"].includes(name) ? "text-black" : "text-white"}`} /></span>}
                            </span>
                            <span className="w-full truncate text-[10px] text-foreground/65">{name}</span>
                        </button>)}
                    </div>
                    {color === "Other" && <Input className="mt-4" value={customColor} onChange={(event) => setCustomColor(event.target.value)} maxLength={50} placeholder="Enter another color" aria-label="Custom requested color" />}
                </fieldset>
                <fieldset className="mt-7">
                    <legend className="text-sm font-semibold text-foreground">Looking for a pattern? <span className="font-normal text-foreground/50">(Optional)</span></legend>
                    <div className="mt-3 flex flex-wrap gap-2">{PATTERNS.map((name) => <button key={name} type="button" aria-pressed={pattern === name} onClick={() => setPattern((current) => current === name ? "" : name)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${pattern === name ? "border-foreground bg-foreground text-primary-foreground" : "border-border bg-background text-foreground/70 hover:border-foreground/40"}`}>{name}</button>)}</div>
                    {pattern === "Other" && <Input className="mt-3" value={customPattern} onChange={(event) => setCustomPattern(event.target.value)} maxLength={100} placeholder="Describe the pattern or design" aria-label="Custom pattern request" />}
                </fieldset>
                <label className="mt-7 block text-sm font-semibold text-foreground">Anything else you'd like us to know?
                    <Textarea className="mt-2 min-h-20 font-normal" value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} placeholder="e.g. Looking for a darker blue or a subtle check pattern" />
                </label>
                <div className="mt-6 rounded-md bg-secondary/50 p-4 text-sm">
                    <p><span className="text-foreground/50">Product:</span> {product.name}</p>
                    <p className="mt-1"><span className="text-foreground/50">Color:</span> {requestedColor || "Not selected"}</p>
                    <p className="mt-1"><span className="text-foreground/50">Pattern:</span> {requestedPattern || "Not selected"}</p>
                </div>
                {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
                <Button type="submit" className="mt-5 w-full sm:w-auto" disabled={saving || !canSubmit}>{saving ? <Loader2 className="animate-spin" /> : <Send />}Submit Request</Button>
            </form>}
        </div>}
    </section>;
}
