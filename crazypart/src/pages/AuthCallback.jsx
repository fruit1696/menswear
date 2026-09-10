import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function AuthCallback() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoadingAuth, authError, profile } = useAuth();

    useEffect(() => {
        if (!isLoadingAuth && isAuthenticated) {
            const returnTo = safeReturnTo();
            const destination = profile?.full_name && profile?.phone
                ? returnTo
                : `/account/setup?returnTo=${encodeURIComponent(returnTo)}`;
            navigate(destination, { replace: true });
        }
    }, [isAuthenticated, isLoadingAuth, navigate, profile]);

    if (authError) return <Navigate to="/login" replace />;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background" role="status">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
            <span className="sr-only">Completing sign in</span>
        </div>
    );
}
