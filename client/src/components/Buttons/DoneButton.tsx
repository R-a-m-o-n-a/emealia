import {ActionIcon, type ActionIconProps, type ElementProps, Loader} from '@mantine/core';
import {TbCheck} from "react-icons/tb";

type DoneButtonProps = ActionIconProps &
    ElementProps<'button', keyof ActionIconProps> & {
    isLoading?: boolean;
};

export function DoneButton({isLoading = false, disabled, ...props}: DoneButtonProps) {
    return (
        <ActionIcon
            aria-label="Done"
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Loader size={16} color="white" /> : <TbCheck size={20} />}
        </ActionIcon>
    );
}