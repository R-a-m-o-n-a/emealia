import {Outlet, ScrollRestoration} from 'react-router';

export function RootLayout() {
    return (
        <div className="Emealia-RootLayout">
            <main className="">
                <Outlet/>
            </main>

            <ScrollRestoration/>
        </div>
    );
}
