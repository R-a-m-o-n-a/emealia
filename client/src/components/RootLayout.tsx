import {Outlet, ScrollRestoration, useLocation} from 'react-router';
import {FloatingTabs} from "./FloatingTabs/FloatingTabs.tsx";

export function RootLayout() {
    const location = useLocation();
    console.log(location.pathname);

    const isFloatingNavVisible = location.pathname === '/plans' || location.pathname === '/meals';

    return (
        <div className="">
            
            <main className="">
                <Outlet/>
            </main>

            {isFloatingNavVisible && (
                <nav>
                    <FloatingTabs/>
                </nav>
            )}

            <ScrollRestoration/>
        </div>
    );
}
