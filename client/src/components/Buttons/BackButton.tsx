import {ActionIcon} from '@mantine/core';
import {useNavigate} from 'react-router';
import {TbArrowLeft} from 'react-icons/tb';

export function BackButton() {
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    return (
        <ActionIcon
            aria-label="Go back"
            onClick={handleBack}
        >
            <TbArrowLeft size={20}/>
        </ActionIcon>
    );
}
