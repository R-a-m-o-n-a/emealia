import type {Meal} from "@emealia/shared";
import {Switch, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect} from "react";
import "./EditMealForm.css";
import {useAuth} from "../../../contexts/AuthContext.tsx";
import {useTagsAndCategories} from "../../../hooks/useTagsAndCategories.tsx";
import {addCategoryIfNew} from "../../../utils/data/helpers/addCategoryIfNew.ts";
import {addTagIfNew} from "../../../utils/data/helpers/addTagIfNew.ts";
import {t} from "../../../utils/translate.ts";
import {CustomAutocompleteWithCreate} from "../../Inputs/CustomAutocompleteWithCreate.tsx";
import {CustomTagsInput} from "../../Inputs/CustomTagsInput.tsx";

export function EditMealForm({existingMeal}: { existingMeal?: Meal }) {
    const {userId} = useAuth();
    const tagsAndCategories = useTagsAndCategories(userId);

    const categories = tagsAndCategories?.categories ?? [];
    const tags = tagsAndCategories?.tags ?? [];
    const categoryNames = categories.map((category) => category.name);
    const tagNames = tags.map((tag) => tag.name);

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
        if (!trimmed) return;

        await addTagIfNew(userId, trimmed);
    };

    const handleCreateCategory = async (newCategory: string) => {
        return await addCategoryIfNew(userId, newCategory);
    };

    return (
        <div className="EditMealForm">
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
                key={form.key("isPrivate")}
                {...form.getInputProps("isPrivate", {type: "checkbox"})}
            />
            <Switch
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
        </div>
    );
}