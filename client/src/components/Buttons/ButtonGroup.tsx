import type {ReactNode} from "react";
import "./ButtonGroup.css";

export function ButtonGroup({children}: { children: ReactNode }) {
    return (
        <div className={"ButtonGroup"}>
            {children}
        </div>
    );
}
