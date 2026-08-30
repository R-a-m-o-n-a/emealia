import {Outlet, ScrollRestoration} from 'react-router';
import {FloatingTabs} from "./FloatingTabs/FloatingTabs.tsx";

export function RootLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            <main className="flex-1 pb-16">
                <Outlet/>
            </main>

            <FloatingTabs/>

            <ScrollRestoration/>
        </div>
    );
}
