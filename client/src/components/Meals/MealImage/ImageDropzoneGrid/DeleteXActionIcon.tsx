import {ActionIcon} from "@mantine/core";
import {TbX} from 'react-icons/tb';

export function DeleteXActionIcon({onClick}: { onClick?: () => void }) {
    return (
        <ActionIcon
            className="ImageDropzoneGrid-removeButton"
            onClick={onClick}
            color="red"
            pos="absolute"
            top="5px"
            right="5px"
            size="sm"
            variant="subtle"
            radius="sm"
        >
            <TbX size={12} />
        </ActionIcon>
    );
}
