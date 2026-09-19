import {ActionIcon} from '@mantine/core';
import {TbChevronLeft} from 'react-icons/tb';
import {useNavigate} from 'react-router';

export function BackButton({onClickOverwrite}: { onClickOverwrite?: () => void | undefined }) {
    const navigate = useNavigate();

    function handleOnClick() {
        if (onClickOverwrite) {
            onClickOverwrite();
        } else {
            navigateBack();
        }
    }

    const navigateBack = () => navigate(-1);

    return (
        <ActionIcon
            aria-label="Go back"
            onClick={handleOnClick}
            style={{paddingRight: '1px'}}
        >
            <TbChevronLeft size={20}/>
        </ActionIcon>
    );
}
