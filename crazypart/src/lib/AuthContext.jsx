import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/api/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState(null);

    const loadProfile = useCallback(async (userId) => {
        if (!supabase || !userId) {
            setProfile(null);
            return null;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, phone, role, created_at, updated_at")
            .eq("id", userId)
            .maybeSingle();

        if (error) throw error;
        setProfile(data);
        return data;
    }, []);

    useEffect(() => {
        if (!supabase) {
            setIsLoadingAuth(false);
            return undefined;
        }

        let active = true;

        supabase.auth.getSession().then(async ({ data, error }) => {
            if (!active) return;
            if (error) {
                setAuthError(error);
            } else {
                setSession(data.session);
                if (data.session?.user) {
                    try {
                        await loadProfile(data.session.user.id);
                    } catch (profileError) {
                        if (active) setAuthError(profileError);
                    }
                }
            }
            if (active) setIsLoadingAuth(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            setAuthError(null);

            if (nextSession?.user) {
                window.setTimeout(() => {
                    loadProfile(nextSession.user.id).catch(setAuthError);
                }, 0);
            } else {
                setProfile(null);
            }
            setIsLoadingAuth(false);
        });

        return () => {
            active = false;
            listener.subscription.unsubscribe();
        };
    }, [loadProfile]);

    const signInWithGoogle = useCallback(async (returnTo = "/") => {
        if (!supabase) throw new Error("Authentication is not configured yet.");

        const callback = new URL("/auth/callback", window.location.origin);
        callback.searchParams.set("returnTo", returnTo);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: callback.toString() },
        });
        if (error) throw error;
    }, []);

    const signInWithPassword = useCallback(async (email, password) => {
        if (!supabase) throw new Error("Authentication is not configured yet.");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }, []);

    const signUpWithPassword = useCallback(async ({ email, password, fullName, phone }) => {
        if (!supabase) throw new Error("Authentication is not configured yet.");
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, phone } },
        });
        if (error) throw error;
        return data;
    }, []);

    const logout = useCallback(async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }, []);

    const value = useMemo(() => ({
        session,
        user: session?.user ?? null,
        profile,
        isAuthenticated: Boolean(session?.user),
        isAdmin: profile?.role === "admin",
        isLoadingAuth,
        authChecked: !isLoadingAuth,
        authError,
        isSupabaseConfigured,
        signInWithGoogle,
        signInWithPassword,
        signUpWithPassword,
        logout,
        refreshProfile: () => loadProfile(session?.user?.id),
    }), [session, profile, isLoadingAuth, authError, logout, signInWithGoogle, signInWithPassword, signUpWithPassword, loadProfile]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
