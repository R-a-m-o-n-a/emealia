import {VisuallyHidden} from '@mantine/core';

import "./CategorySectionHeader.css";

export function CategorySectionHeader({name, id}: { name: string; id: string }) {
    return (
        <div className={"CategorySectionHeader"}>
            <h2>{name}</h2>
            <VisuallyHidden>{id}</VisuallyHidden> {/*todo see if id is useful or remove prop*/}
        </div>
    );
}
