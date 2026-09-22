import {Outlet} from 'react-router';
import {AddButton} from "../Buttons/AddButton.tsx";
import {FloatingTabs} from "../FloatingTabs/FloatingTabs.tsx";

import "./FloatingNav.css";

export function FloatingNavLayout() {
    return (
        <>
            <Outlet />
            <nav className="FloatingNav-element FloatingNav-left">
                <FloatingTabs />
            </nav>
            <nav className="FloatingNav-element FloatingNav-right">
                <AddButton />
            </nav>
        </>
    );
}