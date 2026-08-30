import {Outlet} from 'react-router';
import {FloatingTabs} from "../FloatingTabs/FloatingTabs.tsx";

export function FloatingNavLayout() {
    return (
        <>
            <Outlet/>
            <nav>
                <FloatingTabs/>
            </nav>
        </>
    );
}