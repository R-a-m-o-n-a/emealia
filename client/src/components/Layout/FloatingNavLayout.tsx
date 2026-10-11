import {Outlet, useLocation} from 'react-router';
import {AddButton} from "../Buttons/AddButton.tsx";
import {FloatingTabs} from "../FloatingTabs/FloatingTabs.tsx";

import "./FloatingNav.css";

export function FloatingNavLayout() {
    const location = useLocation();

    const currentPathname = location.pathname.split('/')[1];
    const activeTab = currentPathname === 'plans' ? 'plans' : 'meals';

    return (
        <>
            <Outlet />
            <nav className="FloatingNav">
                <FloatingTabs activeTab={activeTab} />
                <AddButton type={activeTab} />
            </nav>
        </>
    );
}