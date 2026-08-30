import {ActionIcon} from '@mantine/core';
import {TbCheck} from "react-icons/tb";

export function DoneButton({}) {
    return (
        <ActionIcon
            aria-label="Search for a meal"
        >
            <TbCheck size={20}/>
        </ActionIcon>
    );
}
