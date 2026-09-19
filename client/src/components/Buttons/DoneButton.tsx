import {ActionIcon} from '@mantine/core';
import {TbCheck} from "react-icons/tb";

export function DoneButton({onClick}: { onClick?: () => void }) {
    return (
        <ActionIcon
            aria-label="Done"
            onClick={onClick}
        >
            <TbCheck size={20}/>
        </ActionIcon>
    );
}
