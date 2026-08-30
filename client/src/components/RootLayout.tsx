import { Outlet, ScrollRestoration } from 'react-router';
import { FloatingTabs } from "./FloatingTabs.tsx";

export function RootLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            {/* Main Content Area */}
            <main className="flex-1 pb-16">
                <Outlet />
            </main>

            {/* Persistent Bottom Navigation Shell */}
            <FloatingTabs />

            <ScrollRestoration />
        </div>
    );
}
