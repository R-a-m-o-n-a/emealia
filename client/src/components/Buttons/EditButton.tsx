import {ActionIcon} from '@mantine/core';
import {TbPencil} from "react-icons/tb";

export function EditButton({}) {
    return (
        <ActionIcon
            aria-label="Edit"
        >
            <TbPencil size={20}/>
        </ActionIcon>
    );
}
