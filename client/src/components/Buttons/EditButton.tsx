import {ActionIcon} from '@mantine/core';
import {TbPencil} from "react-icons/tb";

export function EditButton({onClick}: { onClick?: () => void }) {
    return (
        <ActionIcon
            aria-label="Edit"
            onClick={onClick}
        >
            <TbPencil size={20}/>
        </ActionIcon>
    );
}
