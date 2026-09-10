import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Unhandled application error", error, errorInfo);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
                <div className="max-w-md text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Something went wrong</p>
                    <h1 className="mt-5 font-display text-4xl font-medium text-foreground">We could not load this page.</h1>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/65">Please try again. Your account and order data remain protected.</p>
                    <Button type="button" className="mt-8" onClick={() => window.location.reload()}><RefreshCw />Try again</Button>
                </div>
            </main>
        );
    }
}
