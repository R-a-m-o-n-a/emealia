import type {IconType} from "react-icons";

import classes from "./InfoIcon.module.css";

export function InfoIcon({Icon}: { Icon: IconType }) {
    return (
        <div className={classes.infoIcon}>
            <Icon size={20} />
        </div>
    );
}