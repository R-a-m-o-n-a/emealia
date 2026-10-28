import {Button, Group, Modal, TextInput} from "@mantine/core";
import {useEffect, useState} from 'react'
import {LuClipboardPaste} from "react-icons/lu";
import {t} from "../../../utils/translate.ts";

import classes from "./RecipeLink.module.css";

interface RecipeLinkEditableProps {
    value?: string;
    onChange: (value: string) => void;
}

function isValidUrl(string: string): boolean {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function PasteLinkButton({value, onChange}: RecipeLinkEditableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value || "");
    console.log(value, onChange);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTempValue(value || "");
    }, [value]);

    async function handleClick() {
        if (value) {
            setTempValue(value);
            setIsModalOpen(true);
            return;
        }

        try {
            const clipboardText = (await navigator.clipboard.readText()).trim();
            if (clipboardText.length > 0 && isValidUrl(clipboardText)) {
                onChange(clipboardText);
                return;
            }
        } catch (error) {
            console.log('Clipboard access denied or unavailable:', error);
        }

        setTempValue("");
        setIsModalOpen(true);
    }

    function handleSave() {
        onChange(tempValue);
        setIsModalOpen(false);
    }

    function handleRemove() {
        onChange("");
        setTempValue("");
        setIsModalOpen(false);
    }

    return (
        <>
            <Button className={value ? classes.recipeLink : classes.emptyRecipeLink}
                    onClick={handleClick}
                    rightSection={!value && <LuClipboardPaste size={20} />}
            >
                {value ? t('Edit Link') : t('Blog')}
            </Button>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('Edit Recipe Link')}
            >
                <TextInput
                    value={tempValue}
                    onChange={(event) => setTempValue(event.currentTarget.value)}
                    placeholder="https://example.com"
                    data-autofocus
                    mb="md"
                />
                <Group justify="flex-end">
                    {value && (
                        <Button color="red" variant="subtle" onClick={handleRemove}>
                            {t('Remove')}
                        </Button>
                    )}
                    <Button onClick={handleSave}>
                        {t('Save')}
                    </Button>
                </Group>
            </Modal>
        </>
    );
}