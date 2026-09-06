import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Fabrics from '@/pages/Fabrics';
import FabricDetail from '@/pages/FabricDetail';
import RefundPolicy from '@/pages/RefundPolicy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ShippingPolicy from '@/pages/ShippingPolicy';
import TermsOfService from '@/pages/TermsOfService';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

    if (isLoadingPublicSettings || isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (authError) {
        if (authError.type === 'user_not_registered') {
            return <UserNotRegisteredError />;
        } else if (authError.type === 'auth_required') {
            navigateToLogin();
            return null;
        }
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/fabrics" element={<Fabrics />} />
                <Route path="/fabrics/:id" element={<FabricDetail />} />
                <Route path="/policies/refund" element={<RefundPolicy />} />
                <Route path="/policies/privacy" element={<PrivacyPolicy />} />
                <Route path="/policies/shipping" element={<ShippingPolicy />} />
                <Route path="/policies/terms" element={<TermsOfService />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};


function App() {

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <ScrollToTop />
                    <AuthenticatedApp />
                </Router>
                <Toaster />
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App