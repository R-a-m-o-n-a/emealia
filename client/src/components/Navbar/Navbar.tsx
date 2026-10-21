import type {ReactNode} from "react";

import classes from './Navbar.module.css';

export function Navbar({children}: { children: ReactNode }) {
    return (
        <div className={classes.navbar}>
            {children}
        </div>
    );
}
