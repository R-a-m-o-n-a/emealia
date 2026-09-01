import {Group, TagsInput, type TagsInputProps, Text} from '@mantine/core';
import {useUncontrolled} from '@mantine/hooks';
import {useState} from 'react';
import {TbPlus} from "react-icons/tb";
import {t} from "../../utils/translate.ts";

const CREATE_PREFIX = "$create:";

interface CustomTagsInputProps extends Omit<TagsInputProps, 'data'> {
    availableOptions: string[];
    onAddNewOption?: (newOption: string) => void;
}

export function CustomTagsInput({
                                    availableOptions,
                                    onAddNewOption,
                                    value,
                                    defaultValue = [],
                                    onChange,
                                    placeholder,
                                    ...props
                                }: CustomTagsInputProps) {

    const [_value, handleChange] = useUncontrolled({
        value,
        defaultValue,
        finalValue: [],
        onChange,
    });

    const [searchValue, setSearchValue] = useState('');

    const trimmedSearch = searchValue.trim();
    const isExactMatch = availableOptions.some(
        (item) => item.toLowerCase() === trimmedSearch.toLowerCase()
    );

    const filteredTags = availableOptions.filter((item) =>
        item.toLowerCase().includes(trimmedSearch.toLowerCase())
    );

    const shouldShowCreateOption = trimmedSearch.length > 0 && !isExactMatch;
    const computedData = shouldShowCreateOption
        ? [...filteredTags, `${CREATE_PREFIX}${trimmedSearch}`]
        : filteredTags;

    const renderOption: TagsInputProps['renderOption'] = ({option}) => {
        if (option.value.startsWith(CREATE_PREFIX)) {
            const newLabel = option.value.replace(CREATE_PREFIX, '');
            return (
                <Group justify="space-between" w="100%">
                    <Text size="sm" c="dimmed">
                        {t("Add")} <strong>"{newLabel}"</strong>
                    </Text>
                    <TbPlus size={16} color="var(--mantine-color-blue-filled)"/>
                </Group>
            );
        }

        return option.value;
    };

    const handleOptionSubmit = (submittedValue: string) => {
        let finalValue = submittedValue;

        if (submittedValue.startsWith(CREATE_PREFIX)) {
            finalValue = submittedValue.replace(CREATE_PREFIX, '').trim();
        }

        onAddNewOption?.(finalValue);

        setSearchValue('');
    };

    function handleChangeIntercepted(newValues: string[]) {
        const cleanedValues = newValues.map((val) =>
            val.startsWith(CREATE_PREFIX) ? val.replace(CREATE_PREFIX, '').trim() : val
        );

        handleChange(cleanedValues);
    }

    return (
        <TagsInput
            {...props}
            value={_value}
            onChange={handleChangeIntercepted}
            data={computedData}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onOptionSubmit={handleOptionSubmit}
            selectFirstOptionOnChange
            renderOption={renderOption}
            placeholder={placeholder}
        />
    );
}