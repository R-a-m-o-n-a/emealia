import {ActionIcon} from '@mantine/core';
import {TbPlus} from 'react-icons/tb';
import {Link} from 'react-router';

interface AddButtonProps {
    type: 'meals' | 'plans';
}

export function AddButton({type}: AddButtonProps) {
    console.log(type);
    const isMeal = type === 'meals';
    const targetPath = isMeal ? '/meals/add' : '/plans/add';
    const label = isMeal ? 'Add meal' : 'Add plan';

    return (
        <ActionIcon
            component={Link}
            to={targetPath}
            aria-label={label}
        >
            <TbPlus size={20} />
        </ActionIcon>
    );
}