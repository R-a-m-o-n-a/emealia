import {ActionIcon} from '@mantine/core';
import {TbSearch} from "react-icons/tb";

export function SearchButton({}) {
    return (
        <ActionIcon
            aria-label="Search for a meal"
        >
            <TbSearch size={20}/>
        </ActionIcon>
    );
}
