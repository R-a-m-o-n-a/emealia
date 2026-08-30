import {Outlet} from 'react-router';
import {FloatingTabs} from "../FloatingTabs/FloatingTabs.tsx";
import {AddButton} from "../Buttons/AddButton.tsx";

import "./FloatingNav.css";

export function FloatingNavLayout() {
    return (
        <>
            <Outlet/>
            <nav className={"FloatingNav"}>
                <FloatingTabs/>
                <AddButton/>
            </nav>
        </>
    );
}