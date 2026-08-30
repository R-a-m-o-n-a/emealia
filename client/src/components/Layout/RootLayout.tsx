import {Outlet, ScrollRestoration} from 'react-router';
import {Navbar} from "../Navbar/Navbar.tsx";

export function RootLayout() {
    return (
        <div className="Emealia-RootLayout">
            <nav className="Navbar">
                <Navbar/>
            </nav>

            <main className="">
                <Outlet/>
            </main>

            <ScrollRestoration/>
        </div>
    );
}
