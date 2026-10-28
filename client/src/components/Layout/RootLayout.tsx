import {Outlet, ScrollRestoration} from 'react-router';

import classes from "./RootLayout.module.css"

export function RootLayout() {
    return (
        <div className={classes.rootLayout}>
            <main className="">
                <Outlet />
            </main>

            <ScrollRestoration />
        </div>
    );
}
