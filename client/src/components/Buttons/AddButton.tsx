import {Link} from 'react-router';
import {ActionIcon} from '@mantine/core';
import {TbPlus} from 'react-icons/tb';

export function AddButton({}) {
    return (
        <ActionIcon
            component={Link}
            to="/meals/add"
            aria-label="Add meal"
        >
            <TbPlus size={20}/>
        </ActionIcon>
    );
}
