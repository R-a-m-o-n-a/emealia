import {Autocomplete, Button, type ComboboxItem, Group, Modal, type OptionsFilter, Text,} from "@mantine/core";
import Fuse from "fuse.js";
import {useState} from "react";
import {TbPlus} from "react-icons/tb";
import {t} from "../../utils/translate.ts";

const CREATE_PREFIX = "$create:";

interface CustomAutocompleteWithCreateProps {
    options: string[];
    value?: string;
    onChange?: (val: string) => void;
    onCreateCategory: (categoryName: string) => Promise<unknown>;
    placeholder?: string;
    key?: string;
}

export function CustomAutocompleteWithCreate({
                                                 options,
                                                 value = "",
                                                 onChange,
                                                 onCreateCategory,
                                                 placeholder,
                                             }: CustomAutocompleteWithCreateProps) {
    const [modalOpened, setModalOpened] = useState(false);
    const [pendingCategory, setPendingCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoryOptionsFilter: OptionsFilter = ({options: rawOptions, search}) => {
        const query = search.trim();
        if (!query) return rawOptions;

        const comboboxOpts = rawOptions as ComboboxItem[];
        const fuse = new Fuse(comboboxOpts, {
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
    };

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
                data={options}
                value={value}
                onChange={onChange}
                filter={categoryOptionsFilter}
                onOptionSubmit={handleOptionSubmit}
                renderOption={({option}) => {
                    const isCreate = option.value.startsWith(CREATE_PREFIX);
                    if (isCreate) {
                        return (
                            <Group gap="xs">
                                <TbPlus size={16}/>
                                <Text size="sm">{t(`Add "${option.value}"`)}</Text>
                            </Group>
                        );
                    }
                    return option.value;
                }}
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