import type {ReactNode} from "react";
import './Navbar.css';

export function Navbar({children}: { children: ReactNode }) {
    return (
        <div className="Navbar">
            {children}
        </div>
    );
}
