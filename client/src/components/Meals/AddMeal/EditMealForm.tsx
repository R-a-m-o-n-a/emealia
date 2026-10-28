import type {Meal, MealImage, Tag} from "@emealia/shared";
import {Box, Button, Group, Switch, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {type Dispatch, type RefObject, type SetStateAction, useEffect, useImperativeHandle, useState} from "react";
import {useAuth} from "../../../contexts/AuthContext.tsx";
import {addCategoryIfNew} from "../../../utils/data/helpers/addCategoryIfNew.ts";
import {addMeal} from "../../../utils/data/helpers/addMeal.ts";
import {addTagIfNew} from "../../../utils/data/helpers/addTagIfNew.ts";
import {updateMeal} from "../../../utils/data/helpers/updateMeal.ts";
import {useTagsAndCategoriesByUser} from "../../../utils/data/helpers/useTagsAndCategoriesByUser.tsx";
import {syncEngine} from "../../../utils/data/syncEngine.ts";
import {t} from "../../../utils/translate.ts";
import {CustomAutocompleteWithCreate} from "../../Inputs/CustomAutocompleteWithCreate.tsx";
import {CustomTagsInput} from "../../Inputs/CustomTagsInput.tsx";
import {PasteLinkButton} from "../LinkButtons/PasteLinkButton.tsx";
import {ImageDropzoneGrid} from "../MealImage/ImageDropzoneGrid/ImageDropzoneGrid.tsx";
import {ImageKind, isExistingImage, type UnifiedImage} from "../MealImage/UnifiedImage.tsx";

import classes from "./EditMealForm.module.css";
import {handlePersistImageChanges} from "./handlePersistImageChanges.ts";

const mapMealImagesToUnifiedImages = (dbImages?: MealImage[]): UnifiedImage[] => {
    if (!dbImages) return [];
    return dbImages.map((img) => ({
        kind: ImageKind.existing,
        id: img.id,
        url: img.publicUrl,
        isMain: img.isMain,
        raw: img,
    }));
};

export interface EditMealFormHandle {
    hasChanges: () => boolean;
}

interface EditMealFormProps {
    existingMeal?: Meal
    existingTags?: Tag[]
    existingCategoryName?: string
    existingImages?: MealImage[]
    isSaving: boolean
    setIsSaving: Dispatch<SetStateAction<boolean>>
    onSuccess?: () => void;
    formRef?: RefObject<EditMealFormHandle | null>
}

export function EditMealForm({
                                 existingMeal,
                                 existingTags,
                                 existingCategoryName,
                                 existingImages,
                                 isSaving,
                                 setIsSaving,
                                 onSuccess,
                                 formRef,
                             }: EditMealFormProps) {
    const {userId} = useAuth();
    const tagsAndCategories = useTagsAndCategoriesByUser(userId);

    const tags = tagsAndCategories?.tags ?? [];
    const categories = tagsAndCategories?.categories ?? [];
    const tagNames = tags.map((tag) => tag.name);
    const categoryNames = categories.map((category) => category.name);

    const [images, setImages] = useState<UnifiedImage[]>(() => mapMealImagesToUnifiedImages(existingImages));

    useEffect(() => {
        if (isSaving) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImages(() => mapMealImagesToUnifiedImages(existingImages));
    }, [existingImages, isSaving]);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: "",
            categoryName: "",
            freeText: "",
            isPrivate: false,
            isToTry: false,
            tagNames: [] as string[],
            recipeLink: "",
            videoLink: "",
        },
        validate: {
            title: (value) => (value.trim().length > 0 ? null : t("Your meal needs a title")),
        },
    });

    useEffect(() => {
        if (!existingMeal) return;

        form.initialize({
            title: existingMeal.title,
            categoryName: existingCategoryName ?? "",
            freeText: existingMeal.freeText || "",
            isPrivate: existingMeal.isPrivate || false,
            isToTry: existingMeal.isToTry || false,
            tagNames: [],
            recipeLink: existingMeal.recipeLink ?? "",
            videoLink: existingMeal.videoLink ?? "",
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingMeal, existingCategoryName]);

    useEffect(() => {
        if (!existingMeal || !tagsAndCategories?.categories) return;

        const matchedCategory = tagsAndCategories.categories.find(
            (category) => category.id === existingMeal.categoryId
        );

        if (matchedCategory) {
            form.setFieldValue("categoryName", matchedCategory.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingMeal, tagsAndCategories?.categories]);

    useEffect(() => {
        if (!existingTags) return;

        form.setFieldValue("tagNames", existingTags.map((tag) => tag.name));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingTags]);

    useImperativeHandle(formRef, () => ({
        hasChanges: () => {
            const currentValues = form.getValues();

            const originalCategoryName = tagsAndCategories?.categories.find(
                (category) => category.id === existingMeal?.categoryId
            )?.name ?? existingCategoryName ?? "";

            const originalTagNames = (existingTags ?? []).map((tag) => tag.name).sort();
            const currentTagNames = [...currentValues.tagNames].sort();

            const initialImageIds = (existingImages ?? []).map((img) => img.id).sort();
            const currentExistingImageIds = images
                .filter((img): img is Extract<UnifiedImage, { kind: "existing" }> => img.kind === "existing")
                .map((img) => img.id)
                .sort();

            const hasNewImages = images.some((img) => img.kind === "new");
            const hasImageChanges =
                hasNewImages ||
                JSON.stringify(initialImageIds) !== JSON.stringify(currentExistingImageIds);
            const hasImageOrderChanges = images.some((img, index) => {
                if (!isExistingImage(img)) return false;
                const originalImage = existingImages?.find((existingImage) => existingImage.id === img.id);
                return originalImage ? originalImage.position !== index : false;
            });

            return (
                currentValues.title !== (existingMeal?.title ?? "") ||
                currentValues.categoryName !== originalCategoryName ||
                currentValues.freeText !== (existingMeal?.freeText || "") ||
                currentValues.isPrivate !== (existingMeal?.isPrivate || false) ||
                currentValues.isToTry !== (existingMeal?.isToTry || false) ||
                JSON.stringify(currentTagNames) !== JSON.stringify(originalTagNames) ||
                currentValues.recipeLink !== (existingMeal?.recipeLink ?? "") ||
                currentValues.videoLink !== (existingMeal?.videoLink ?? "") ||
                hasImageChanges ||
                hasImageOrderChanges
            );
        }
    }));

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

        setIsSaving(true);

        try {
            const upsertMealInput = {
                title: values.title,
                freeText: values.freeText,
                isPrivate: values.isPrivate,
                isToTry: values.isToTry,
                categoryId: tagsAndCategories?.categories.find(category => category.name === values.categoryName)?.id,
                tagIds: tagsAndCategories?.tags.filter((tag) => values.tagNames.includes(tag.name)).map((tag) => tag.id),
                recipeLink: values.recipeLink,
                videoLink: values.videoLink,
            }

            const mealId = existingMeal?.id ?? crypto.randomUUID();

            if (existingMeal?.id) {
                await updateMeal(userId, existingMeal.id, upsertMealInput);
            } else {
                await addMeal(userId, mealId, upsertMealInput);
            }

            await handlePersistImageChanges(existingImages, images, mealId, userId);

            await syncEngine.runSync();
            onSuccess?.();
        } catch (error) {
            console.error("Failed to add meal:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const recipeLink = form.useWatchValue("recipeLink");
    const videoLink = form.useWatchValue("videoLink");

    return (
        <form id="edit-meal-form" onSubmit={form.onSubmit(handleSubmit)} className={classes.editMealForm}>
            <Box>
                <TextInput
                    radius="sm"
                    placeholder={t("Title")}
                    withAsterisk
                    key={form.key("title")}
                    {...form.getInputProps("title")}
                />
                <Switch
                    label={t("Private")}
                    key={form.key("isPrivate")}
                    {...form.getInputProps("isPrivate", {type: "checkbox"})}
                />
            </Box>

            <CustomAutocompleteWithCreate
                placeholder={t("Choose Category")}
                options={categoryNames}
                onCreate={handleCreateCategory}
                key={`${form.key("categoryName")}`}
                {...form.getInputProps("categoryName")}
            />

            <Box>
                <PasteLinkButton
                    value={recipeLink}
                    onChange={(val) => form.setFieldValue("recipeLink", val)}
                />
                <PasteLinkButton
                    value={videoLink}
                    onChange={(val) => form.setFieldValue("videoLink", val)}
                />

                <Switch
                    label={t("To Try")}
                    key={form.key("isToTry")}
                    {...form.getInputProps("isToTry", {type: "checkbox"})}
                />
            </Box>

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

            <ImageDropzoneGrid images={images} setImages={setImages} />

            <Group justify="flex-end" mt="md">
                <Button loading={isSaving} type="submit">{t("Save Meal")}</Button>
            </Group>
        </form>
    );
}