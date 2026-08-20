import { NavLink, type NavLinkRenderProps, Outlet, ScrollRestoration } from 'react-router-dom';

export function RootLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            {/* Main Content Area */}
            <main className="flex-1 pb-16">
                <Outlet />
            </main>

            {/* Persistent Bottom Navigation Shell */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40">
                <NavLink to="/" className={({isActive}: NavLinkRenderProps) =>
                    `text-xs font-medium ${isActive ? 'text-green-600' : 'text-slate-500'}`
                }>
                    Meals
                </NavLink>
                <NavLink to="/plans" className={({isActive}: NavLinkRenderProps) =>
                    `text-xs font-medium ${isActive ? 'text-green-600' : 'text-slate-500'}`
                }>
                    Plans
                </NavLink>
            </nav>

            <ScrollRestoration />
        </div>
    );
}
