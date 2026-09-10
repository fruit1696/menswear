import React, { useState } from "react";
import { LogIn, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { safeReturnTo } from "@/lib/authReturnTo";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login({ mode = "login" }) {
    const { signInWithGoogle, signInWithPassword, signUpWithPassword, isSupabaseConfigured, isAuthenticated, isLoadingAuth } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
    const isRegister = mode === "register";
    const isAccountEntry = mode === "account";

    if (!isLoadingAuth && isAuthenticated) {
        return <Navigate to={safeReturnTo()} replace />;
    }

    const handleGoogleSignIn = async () => {
        setError("");
        setMessage("");
        setLoading(true);
        try {
            const returnTo = safeReturnTo();
            await signInWithGoogle(isAccountEntry && returnTo === "/" ? "/account" : returnTo);
        } catch (signInError) {
            setError(signInError.message || "Unable to continue with Google.");
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            if (isRegister) {
                const { session } = await signUpWithPassword(form);
                if (!session) {
                    setMessage("Check your email to confirm your account, then sign in.");
                    setLoading(false);
                    return;
                }
                navigate(`/account/setup?returnTo=${encodeURIComponent(safeReturnTo())}`, { replace: true });
            } else {
                await signInWithPassword(form.email, form.password);
                navigate(safeReturnTo(), { replace: true });
            }
        } catch (authError) {
            setError(authError.message || "Unable to continue.");
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            icon={LogIn}
            title={isRegister ? "Create your account" : isAccountEntry ? "Login / Sign Up" : "Welcome back"}
            subtitle={isRegister ? "Create your account with email or Google" : "Sign in securely with email or Google"}
        >
            {error && (
                <div role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}
            {message && <div role="status" className="mb-4 rounded-lg bg-accent/10 p-3 text-sm text-foreground">{message}</div>}
            {!isSupabaseConfigured && (
                <div role="status" className="mb-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                    Authentication will be available after the Supabase environment is configured.
                </div>
            )}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {isRegister && <label className="block space-y-2"><Label htmlFor="signup-name">Name</Label><Input id="signup-name" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} autoComplete="name" /></label>}
                <label className="block space-y-2"><Label htmlFor="auth-email">Email</Label><Input id="auth-email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" /></label>
                {isRegister && <label className="block space-y-2"><Label htmlFor="signup-phone">Phone Number</Label><Input id="signup-phone" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} autoComplete="tel" /></label>}
                <label className="block space-y-2"><Label htmlFor="auth-password">Password</Label><Input id="auth-password" required minLength={6} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete={isRegister ? "new-password" : "current-password"} /></label>
                <Button type="submit" className="h-12 w-full text-sm font-medium" disabled={loading || !isSupabaseConfigured}>{loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}{isRegister ? "Create account" : "Sign in"}</Button>
            </form>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><span>or</span><span className="h-px flex-1 bg-border" /></div>
            <Button
                type="button"
                variant="outline"
                className="h-12 w-full text-sm font-medium"
                onClick={handleGoogleSignIn}
                disabled={loading || !isSupabaseConfigured}
            >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
                Continue with Google
            </Button>
        </AuthLayout>
    );
}
