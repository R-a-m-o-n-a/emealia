import {Autocomplete, Button, type ComboboxItem, Group, Modal, Text} from "@mantine/core";
import Fuse from "fuse.js";
import {useMemo, useState} from "react";
import {TbPlus} from "react-icons/tb";
import {t} from "../../utils/translate.ts";

const CREATE_PREFIX = "$create:";

interface CustomAutocompleteWithCreateProps {
    options: string[];
    value?: string;
    defaultValue?: string;
    onChange?: (val: string) => void;
    onCreateCategory: (categoryName: string) => Promise<unknown>;
    placeholder?: string;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export function CustomAutocompleteWithCreate({
                                                 options,
                                                 value,
                                                 defaultValue,
                                                 onChange,
                                                 onCreateCategory,
                                                 placeholder,
                                                 ...remainingProps
                                             }: CustomAutocompleteWithCreateProps) {
    const [modalOpened, setModalOpened] = useState(false);
    const [pendingCategory, setPendingCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    // Dynamically compute options so Mantine's `data` includes the dynamic create option, otherwise there will be an error since it cannot access the label of the "add Category" option
    const computedData = useMemo<ComboboxItem[]>(() => {
        const query = searchValue.trim();
        const baseOptions: ComboboxItem[] = options.map((opt) => ({
            value: opt,
            label: opt,
        }));

        if (!query) return baseOptions;

        const fuse = new Fuse(baseOptions, {
            keys: ["label"],
            threshold: 0.3,
            minMatchCharLength: 1,
        });

        const results = fuse.search(query).map((res) => res.item);

        const exactMatch = options.some(
            (option) => option.toLowerCase() === query.toLowerCase()
        );

        if (!exactMatch) {
            results.push({
                value: `${CREATE_PREFIX}${query}`,
                label: query,
            });
        }

        return results;
    }, [options, searchValue]);

    const handleOptionSubmit = (val: string) => {
        if (val.startsWith(CREATE_PREFIX)) {
            const newCategoryName = val.replace(CREATE_PREFIX, "");
            setPendingCategory(newCategoryName);
            setModalOpened(true);
        } else {
            onChange?.(val);
        }
    };

    const handleConfirmCreate = async () => {
        if (!pendingCategory) return;
        setIsSubmitting(true);
        try {
            await onCreateCategory(pendingCategory);
            onChange?.(pendingCategory);
            setModalOpened(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Autocomplete
                placeholder={placeholder}
                data={computedData}
                value={value}
                defaultValue={defaultValue}
                selectFirstOptionOnChange
                // Maintain search string state to feed computedData
                onOptionSubmit={handleOptionSubmit}
                onChange={(val) => {
                    setSearchValue(val);
                    // Avoid pushing dirty CREATE_PREFIX text into Form state directly
                    if (!val.startsWith(CREATE_PREFIX)) {
                        onChange?.(val);
                    }
                }}
                // Disable internal component filtering as computedData handles it
                filter={({options: opts}) => opts}
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