import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AdminRoute() {
    const { isAdmin, isLoadingAuth, isAuthenticated } = useAuth();

    if (isLoadingAuth) {
        return <div className="min-h-screen bg-background" aria-busy="true" />;
    }

    if (!isAuthenticated) return <Navigate to="/login?returnTo=%2Fadmin%2Fcatalog" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return <Outlet />;
}
