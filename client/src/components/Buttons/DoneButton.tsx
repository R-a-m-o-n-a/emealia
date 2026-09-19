import {ActionIcon, type ActionIconProps, type ElementProps} from '@mantine/core';
import {TbCheck} from "react-icons/tb";

interface DoneButtonProps extends ActionIconProps, ElementProps<'button', keyof ActionIconProps> {
}

export function DoneButton(props: DoneButtonProps) {
    return (
        <ActionIcon
            aria-label="Done"
            {...props}
        >
            <TbCheck size={20} />
        </ActionIcon>
    );
}
