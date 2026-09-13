import type {Meal} from "@emealia/shared";
import {Button, Group, Switch, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";
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

    const categories = tagsAndCategories?.categories ?? [];
    const tags = tagsAndCategories?.tags ?? [];
    const categoryNames = categories.map((category) => category.name);
    const tagNames = tags.map((tag) => tag.name);

    const [recipeLink, setRecipeLink] = useState<string>(existingMeal?.recipeLink ?? "");
    const [videoLink, setVideoLink] = useState<string>(existingMeal?.videoLink ?? "");

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: "",
            category: "",
            freeText: "",
            isPrivate: false,
            isToTry: false,
            tags: [] as string[],
        },
        validate: {
            title: (value) => (value.trim().length > 0 ? null : t("Your meal needs a title")),
        },
    });

    useEffect(() => {
        if (existingMeal) {
            form.initialize({
                title: existingMeal.title,
                category: existingMeal.categoryId || "", // todo fetch category name
                freeText: existingMeal.freeText || "",
                isPrivate: existingMeal.isPrivate || false,
                isToTry: existingMeal.isToTry || false,
                tags: [], // todo fetch tags
            });
        }
    }, [existingMeal, form]);

    const handleAddNewTag = async (newTag: string) => {
        const trimmed = newTag.trim();
        if (!trimmed || !userId) return;

        const tagId = await addTagIfNew(userId, trimmed);
        return tagId;
    };

    const handleCreateCategory = async (newCategory: string) => {
        if (!userId) return "";
        const categoryId = await addCategoryIfNew(userId, newCategory);
        return categoryId;
    };

    const handleSubmit = async (values: typeof form.values) => {
        if (!userId) return;

        try {
            await addMeal(userId, {
                title: values.title,
                category: values.category,
                freeText: values.freeText,
                isPrivate: values.isPrivate,
                isToTry: values.isToTry,
                categoryId: values.category,
                tagIds: values.tags,
                recipeLink,
                videoLink,
            });

            form.reset();
            setRecipeLink("");
            setVideoLink("");

            if (onSuccess) {
                onSuccess();
            }
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
                options={categoryNames}
                onCreateCategory={handleCreateCategory}
                key={form.key("category")}
                {...form.getInputProps("category")}
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
                onAddNewOption={handleAddNewTag}
                key={form.key("tags")}
                {...form.getInputProps("tags")}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t("Save Meal")}</Button>
            </Group>
        </form>
    );
}