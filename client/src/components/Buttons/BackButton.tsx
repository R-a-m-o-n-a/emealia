import {ActionIcon} from '@mantine/core';
import {TbChevronLeft} from 'react-icons/tb';
import {useNavigate} from 'react-router';

export function BackButton() {
    const navigate = useNavigate();

    const navigateBack = () => navigate(-1);

    return (
        <ActionIcon
            aria-label="Go back"
            onClick={navigateBack}
            style={{paddingRight: '1px'}}
        >
            <TbChevronLeft size={20}/>
        </ActionIcon>
    );
}
