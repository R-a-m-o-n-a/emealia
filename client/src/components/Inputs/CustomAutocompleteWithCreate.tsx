import {Autocomplete, Button, Group, Modal, Text} from "@mantine/core";
import Fuse from "fuse.js";
import {useMemo, useState} from "react";
import {TbPlus} from "react-icons/tb";
import {t} from "../../utils/translate.ts";

const CREATE_PREFIX = "$create:";

interface CustomAutocompleteWithCreateProps {
    options: string[];
    value?: string;
    onChange?: (val: string) => void;
    onCreate: (name: string) => Promise<string | null>;
    placeholder?: string;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// todo use value as key?
export function CustomAutocompleteWithCreate({
                                                 options,
                                                 value = "",
                                                 onChange,
                                                 onCreate,
                                                 placeholder,
                                                 ...remainingProps
                                             }: CustomAutocompleteWithCreateProps) {
    const [modalOpened, setModalOpened] = useState(false);
    const [pendingCategory, setPendingCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [inputValue, setInputValue] = useState(value);

    const fuse = useMemo(() => {
        return new Fuse(options, {
            threshold: 0.3,
            minMatchCharLength: 1,
        });
    }, [options]);

    const computedData = useMemo<string[]>(() => {
        const query = inputValue.trim();
        if (!query) return options;

        const results = fuse.search(query).map((res) => res.item);

        const exactMatch = options.some(
            (option) => option.toLowerCase() === query.toLowerCase()
        );

        if (!exactMatch) {
            results.push(`${CREATE_PREFIX}${query}`);
        }

        return results;
    }, [options, inputValue, fuse]);

    const handleInputChange = (val: string) => {
        const cleanValue = val.startsWith(CREATE_PREFIX)
            ? val.replace(CREATE_PREFIX, "")
            : val;

        setInputValue(cleanValue);

        if (!val.startsWith(CREATE_PREFIX)) {
            onChange?.(cleanValue);
        }
    };

    const handleOptionSubmit = (val: string) => {
        if (val.startsWith(CREATE_PREFIX)) {
            const newCategoryName = val.replace(CREATE_PREFIX, "");
            setPendingCategory(newCategoryName);
            setInputValue(newCategoryName);
            setModalOpened(true);
        } else {
            setInputValue(val);
            onChange?.(val);
        }
    };

    const handleConfirmCreate = async () => {
        if (!pendingCategory) return;
        setIsSubmitting(true);
        try {
            const created = await onCreate(pendingCategory);
            if (created !== null) {
                setInputValue(pendingCategory);
                onChange?.(pendingCategory);
                setModalOpened(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Autocomplete
                placeholder={placeholder}
                data={computedData}
                value={inputValue}
                selectFirstOptionOnChange
                onOptionSubmit={handleOptionSubmit}
                onChange={handleInputChange}
                renderOption={({option}) => {
                    const isCreate = option.value.startsWith(CREATE_PREFIX);
                    if (isCreate) {
                        const cleanLabel = option.value.replace(CREATE_PREFIX, "");
                        return (
                            <Group gap="xs">
                                <TbPlus size={16}/>
                                <Text size="sm">{t(`Add "${cleanLabel}"`)}</Text>
                            </Group>
                        );
                    }
                    return option.value;
                }}
                {...remainingProps}
            />

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={t("Create new category")}
                centered
            >
                <Text mb="lg">
                    {t("Are you sure you want to add")} <strong>"{pendingCategory}"</strong> {t("as a new category?")}
                </Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={() => setModalOpened(false)}>
                        {t("Cancel")}
                    </Button>
                    <Button loading={isSubmitting} onClick={handleConfirmCreate}>
                        {t("Add Category")}
                    </Button>
                </Group>
            </Modal>
        </>
    );
}