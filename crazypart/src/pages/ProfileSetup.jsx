import React, { useEffect, useState } from "react";
import { Check, Loader2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { safeReturnTo } from "@/lib/authReturnTo";
import { updateProfile } from "@/features/account/accountService";

export default function ProfileSetup() {
    const { user, profile, refreshProfile, isAuthenticated, isLoadingAuth } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ full_name: "", phone: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setForm({
            full_name: profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "",
            phone: profile?.phone || "",
        });
    }, [profile, user]);

    useEffect(() => {
        if (!isLoadingAuth && (!isAuthenticated || (profile?.full_name && profile?.phone))) {
            navigate(safeReturnTo(), { replace: true });
        }
    }, [isAuthenticated, isLoadingAuth, navigate, profile]);

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        try {
            await updateProfile(user.id, form);
            await refreshProfile();
            navigate(safeReturnTo(), { replace: true });
        } catch (submitError) {
            setError(submitError.message || "Unable to save your profile.");
            setSaving(false);
        }
    };

    if (isLoadingAuth || !user) {
        return <div className="fixed inset-0 flex items-center justify-center bg-background" role="status"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <AuthLayout icon={UserRound} title="Complete your account" subtitle="Just the basics to get you started">
            {error && <div role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <form onSubmit={submit} className="space-y-5">
                <label className="block space-y-2"><Label htmlFor="profile-name">Name</Label><Input id="profile-name" required value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} autoComplete="name" /></label>
                <label className="block space-y-2"><Label htmlFor="profile-email">Email</Label><Input id="profile-email" value={user.email || ""} readOnly autoComplete="email" /></label>
                <label className="block space-y-2"><Label htmlFor="profile-phone">Phone Number</Label><Input id="profile-phone" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} autoComplete="tel" /></label>
                <Button type="submit" className="w-full" disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Check />}Continue</Button>
            </form>
        </AuthLayout>
    );
}
