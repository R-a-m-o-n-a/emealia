import type {IconType} from "react-icons";

import "./InfoIcon.css";

export function InfoIcon({Icon}: { Icon: IconType }) {
    return (
        <div className={"InfoIcon"}>
            <Icon size={20}/>
        </div>
    );
}