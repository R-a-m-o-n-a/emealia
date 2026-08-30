import {useShowAppMenu} from './useShowAppMenu.ts';
import {MenuButton} from '../Buttons/MenuButton.tsx';
import {BackButton} from '../Buttons/BackButton.tsx';
import './Navbar.css';

export function Navbar() {
    const showAppMenu = useShowAppMenu();

    return (
        <div className="Navbar">
            {showAppMenu ? <MenuButton/> : <BackButton/>}
        </div>
    );
}
