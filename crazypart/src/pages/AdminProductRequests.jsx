import React from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { listAdminProductOptionRequests, updateProductOptionRequest } from "@/features/productRequests/productRequestService";

const NEXT_STATUSES = {
    new: ["new", "checking"],
    checking: ["checking", "replied"],
    replied: ["replied", "closed"],
    closed: ["closed"],
};

export default function AdminProductRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = React.useState([]);
    const [drafts, setDrafts] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [savingId, setSavingId] = React.useState(null);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        listAdminProductOptionRequests().then((items) => {
            setRequests(items);
            setDrafts(Object.fromEntries(items.map((item) => [item.id, { status: item.status, admin_reply: item.admin_reply ?? "" }])));
        }).catch((loadError) => setError(loadError.message || "Unable to load customer requests.")).finally(() => setLoading(false));
    }, []);

    const save = async (requestId) => {
        const draft = drafts[requestId];
        setSavingId(requestId); setError("");
        try {
            const updated = await updateProductOptionRequest(requestId, { status: draft.status, admin_reply: draft.admin_reply.trim() || null });
            setRequests((current) => current.map((item) => item.id === requestId ? { ...item, ...updated } : item));
        } catch (saveError) { setError(saveError.message || "Unable to save the reply."); }
        finally { setSavingId(null); }
    };

    return <div className="min-h-screen bg-background px-5 pb-20 pt-32 sm:px-8"><div className="mx-auto max-w-6xl">
        <div className="border-b border-border/60 pb-8"><p className="text-[11px] uppercase tracking-[0.3em] text-accent">Admin requests</p><h1 className="mt-4 font-display text-4xl font-medium sm:text-5xl">Color & pattern requests</h1><p className="mt-4 text-foreground/65">Review customer preferences and reply without leaving the website.</p><p className="mt-2 text-sm text-foreground/50">Signed in as {user?.email}</p></div>
        {error && <p role="alert" className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {loading ? <p className="flex items-center gap-2 py-12 text-sm text-foreground/60"><Loader2 className="h-4 w-4 animate-spin" />Loading requests...</p> : requests.length === 0 ? <p className="py-12 text-sm text-foreground/60">No customer requests yet.</p> : <div className="mt-8 grid gap-5">{requests.map((request) => <article key={request.id} className="rounded-lg border border-border/60 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row"><img src={request.product_image} alt="" className="h-28 w-24 shrink-0 rounded-md bg-secondary object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-2xl">{request.product_name}</h2><p className="mt-1 text-xs text-foreground/50">Request {request.id} · {new Date(request.created_at).toLocaleString()}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize">{request.status}</span></div><dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3"><div><dt className="text-foreground/50">Customer</dt><dd>{request.customer_name}</dd></div><div><dt className="text-foreground/50">Color</dt><dd>{request.requested_color || "—"}</dd></div><div><dt className="text-foreground/50">Pattern</dt><dd>{request.requested_pattern || "—"}</dd></div></dl>{request.customer_note && <p className="mt-4 rounded-md bg-secondary/50 p-3 text-sm"><span className="text-foreground/50">Note: </span>{request.customer_note}</p>}
                <div className="mt-5 grid gap-3 sm:grid-cols-[180px_1fr_auto]"><select value={drafts[request.id]?.status ?? request.status} onChange={(event) => setDrafts((current) => ({ ...current, [request.id]: { ...current[request.id], status: event.target.value } }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label={`Status for ${request.product_name}`}>{NEXT_STATUSES[request.status].map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select><Textarea value={drafts[request.id]?.admin_reply ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [request.id]: { ...current[request.id], admin_reply: event.target.value } }))} maxLength={2000} placeholder="Write a reply for the customer" aria-label={`Reply to ${request.customer_name}`} /><Button onClick={() => save(request.id)} disabled={savingId === request.id}>{savingId === request.id ? <Loader2 className="animate-spin" /> : <Save />}Save</Button></div>
            </div></div>
        </article>)}</div>}
    </div></div>;
}
