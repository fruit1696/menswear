import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Fabrics from '@/pages/Fabrics';
import FabricDetail from '@/pages/FabricDetail';
import RefundPolicy from '@/pages/RefundPolicy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ShippingPolicy from '@/pages/ShippingPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AuthCallback from '@/pages/AuthCallback';
import ProfileSetup from '@/pages/ProfileSetup';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/features/admin/AdminRoute';
import AdminCatalog from '@/pages/AdminCatalog';
import { CartProvider } from '@/features/cart/CartProvider';
import Cart from '@/pages/Cart';
import Account from '@/pages/Account';
import Checkout from '@/pages/Checkout';
import AdminOrders from '@/pages/AdminOrders';
import AdminProducts from '@/pages/AdminProducts';
import Wishlist from '@/pages/Wishlist';
import ErrorBoundary from '@/components/ErrorBoundary';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/fabrics" element={<Fabrics />} />
                <Route path="/fabrics/:id" element={<FabricDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/account" element={<Account />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<Checkout />} />
                </Route>
                <Route path="/policies/refund" element={<RefundPolicy />} />
                <Route path="/policies/privacy" element={<PrivacyPolicy />} />
                <Route path="/policies/shipping" element={<ShippingPolicy />} />
                <Route path="/policies/terms" element={<TermsOfService />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/catalog" element={<AdminCatalog />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                    </Route>
                </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/account/setup" element={<ProfileSetup />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};


function App() {

    return (
        <ErrorBoundary>
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <CartProvider>
                <Router>
                    <ScrollToTop />
                    <AppRoutes />
                </Router>
                </CartProvider>
                <Toaster />
                <Analytics />
            </QueryClientProvider>
        </AuthProvider>
        </ErrorBoundary>
    )
}

export default App
