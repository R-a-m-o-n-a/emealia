import type {Meal} from "@emealia/shared";
import {Button, Group, Switch, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";
import "./EditMealForm.css";
import {useAuth} from "../../../contexts/AuthContext.tsx";
import {addCategoryIfNew} from "../../../utils/data/helpers/addCategoryIfNew.ts";
import {addMeal} from "../../../utils/data/helpers/addMeal.ts";
import {addTagIfNew} from "../../../utils/data/helpers/addTagIfNew.ts";
import {updateMeal} from "../../../utils/data/helpers/updateMeal.ts";
import {useTagsAndCategoriesByUser} from "../../../utils/data/helpers/useTagsAndCategoriesByUser.tsx";
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
    const tagsAndCategories = useTagsAndCategoriesByUser(userId);


    const tags = tagsAndCategories?.tags ?? [];
    const categories = tagsAndCategories?.categories ?? [];
    const tagNames = tags.map((tag) => tag.name);
    const categoryNames = categories.map((category) => category.name);

    const [recipeLink, setRecipeLink] = useState<string>(existingMeal?.recipeLink ?? "");
    const [videoLink, setVideoLink] = useState<string>(existingMeal?.videoLink ?? "");

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: "",
            categoryName: "",
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
                categoryName: tagsAndCategories?.categories.find(category => category.id === existingMeal.categoryId)?.name ?? "",
                freeText: existingMeal.freeText || "",
                isPrivate: existingMeal.isPrivate || false,
                isToTry: existingMeal.isToTry || false,
                tagNames: [], // todo fetch mealtagrelations
            });
        }
    }, [existingMeal, form, tagsAndCategories]);

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

        const upsertMealInput = {
            title: values.title,
            freeText: values.freeText,
            isPrivate: values.isPrivate,
            isToTry: values.isToTry,
            categoryId: tagsAndCategories?.categories.find(category => category.name === values.categoryName)?.id,
            tagIds: tagsAndCategories?.tags.filter((tag) => values.tagNames.includes(tag.name)).map((tag) => tag.id),
            recipeLink,
            videoLink,
        }

        try {
            if (existingMeal?.id) {
                await updateMeal(userId, existingMeal.id, upsertMealInput)
            } else {
                await addMeal(userId, upsertMealInput);
            }
            // todo close window
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
                options={categoryNames}
                onCreate={handleCreateCategory}
                key={form.key("categoryName")}
                {...form.getInputProps("categoryName")}
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
                key={form.key("tagNames")}
                {...form.getInputProps("tagNames")}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t("Save Meal")}</Button>
            </Group>
        </form>
    );
}