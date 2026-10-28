import {ActionIcon} from "@mantine/core";
import {TbX} from 'react-icons/tb';

export function DeleteXActionIcon({onClick}: { onClick?: () => void }) {
    return (
        <ActionIcon
            onClick={onClick}
            color="red"
            pos="absolute"
            top="2px"
            right="2px"
            size="md"
            variant="subtle"
            radius="sm"
        >
            <TbX size={18} />
        </ActionIcon>
    );
}
