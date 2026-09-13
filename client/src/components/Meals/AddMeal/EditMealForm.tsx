import type {Meal} from "@emealia/shared";
import {Button, Group, Switch, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect, useMemo, useState} from "react";
import "./EditMealForm.css";
import {useAuth} from "../../../contexts/AuthContext.tsx";
import {useTagsAndCategories} from "../../../hooks/useTagsAndCategories.tsx";
import {addCategoryIfNew} from "../../../utils/data/helpers/addCategoryIfNew.ts";
import {addMeal} from "../../../utils/data/helpers/addMeal.ts";
import {addTagIfNew} from "../../../utils/data/helpers/addTagIfNew.ts";
import {t} from "../../../utils/translate.ts";
import {CustomAutocompleteWithCreate} from "../../Inputs/CustomAutocompleteWithCreate.tsx";
import {CustomTagsInput} from "../../Inputs/CustomTagsInput.tsx";

interface EditMealFormProps {
    existingMeal?: Meal;
    onSuccess?: () => void;
}

// todo use mealId as key when calling the component to reset state if meal changes
export function EditMealForm({existingMeal, onSuccess}: EditMealFormProps) {
    const {userId} = useAuth();
    const tagsAndCategories = useTagsAndCategories(userId);

    // Format options into clean { label, value } structures using useMemo
    const categoryOptions = useMemo(
        () => (tagsAndCategories?.categories ?? []).map((c) => ({label: c.name, value: c.id})),
        [tagsAndCategories?.categories]
    );

    const tags = tagsAndCategories?.tags ?? [];
    const tagNames = tags.map((tag) => tag.name);

    const [recipeLink, setRecipeLink] = useState<string>(existingMeal?.recipeLink ?? "");
    const [videoLink, setVideoLink] = useState<string>(existingMeal?.videoLink ?? "");

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: "",
            categoryId: "",
            freeText: "",
            isPrivate: false,
            isToTry: false,
            tagNames: [] as string[],
        },
        validate: {
            title: (value) => (value.trim().length > 0 ? null : t("Your meal needs a title")),
        },
    });

    useEffect(() => {
        if (existingMeal) {
            form.initialize({
                title: existingMeal.title,
                categoryId: existingMeal.categoryId || "",
                freeText: existingMeal.freeText || "",
                isPrivate: existingMeal.isPrivate || false,
                isToTry: existingMeal.isToTry || false,
                tagNames: [], // todo fetch mealtagrelations
            });
        }
    }, [existingMeal, form]);

    const handleCreateCategory = async (name: string): Promise<string | null> => {
        if (!userId) return null;
        return await addCategoryIfNew(userId, name);
    };

    const handleCreateTag = async (name: string): Promise<string | null> => {
        const trimmed = name.trim();
        if (!trimmed || !userId) return null;
        return await addTagIfNew(userId, trimmed);
    };

    const handleSubmit = async (values: typeof form.values) => {
        if (!userId) return;

        try {
            await addMeal(userId, {
                title: values.title,
                freeText: values.freeText,
                isPrivate: values.isPrivate,
                isToTry: values.isToTry,
                categoryId: values.categoryId,
                tagNames: values.tagNames,
                recipeLink,
                videoLink,
            });

            form.reset();
            setRecipeLink("");
            setVideoLink("");

            onSuccess?.();
        } catch (error) {
            console.error("Failed to add meal:", error);
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} className="EditMealForm">
            <TextInput
                radius="sm"
                placeholder={t("Title")}
                withAsterisk
                key={form.key("title")}
                {...form.getInputProps("title")}
            />

            <CustomAutocompleteWithCreate
                placeholder={t("Choose Category")}
                options={categoryOptions}
                onCreate={handleCreateCategory}
                key={form.key("categoryId")}
                {...form.getInputProps("categoryId")}
            />

            <Switch
                label={t("Private")}
                key={form.key("isPrivate")}
                {...form.getInputProps("isPrivate", {type: "checkbox"})}
            />

            <Switch
                label={t("To Try")}
                key={form.key("isToTry")}
                {...form.getInputProps("isToTry", {type: "checkbox"})}
            />

            <Textarea
                placeholder={t("Here you can type anything your heart desires")}
                key={form.key("freeText")}
                {...form.getInputProps("freeText")}
            />

            <CustomTagsInput
                placeholder={t("Select or add tags")}
                availableOptions={tagNames}
                onAddNewOption={handleCreateTag}
                key={form.key("tagIds")}
                {...form.getInputProps("tagIds")}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t("Save Meal")}</Button>
            </Group>
        </form>
    );
}