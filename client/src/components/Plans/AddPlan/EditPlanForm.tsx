import type {Plan} from "@emealia/shared";
import {Button, Checkbox, Group, TextInput} from "@mantine/core";
import {DatePickerInput} from '@mantine/dates'; // todo add date locale https://mantine.dev/dates/getting-started/#datesprovider
import {useForm} from "@mantine/form";
import {type Dispatch, type RefObject, type SetStateAction, useEffect, useImperativeHandle, useState} from "react";
import {useAuth} from "../../../contexts/AuthContext.tsx";
import {addPlan} from "../../../utils/data/helpers/addPlan.ts";
import {updatePlan} from "../../../utils/data/helpers/updatePlan.ts";
import {syncEngine} from "../../../utils/data/syncEngine.ts";
import {t} from "../../../utils/translate.ts";
import {MealThumbnail} from "../../Meals/MealImage/MealThumbnail.tsx";

import classes from "./EditPlanForm.module.css"

export interface EditPlanFormHandle {
    hasChanges: () => boolean;
}

interface EditPlanFormProps {
    existingPlan?: Partial<Plan>
    isSaving: boolean
    setIsSaving: Dispatch<SetStateAction<boolean>>
    onSuccess?: () => void;
    formRef?: RefObject<EditPlanFormHandle | null>
}

export function EditPlanForm({
                                 existingPlan,
                                 isSaving,
                                 setIsSaving,
                                 onSuccess,
                                 formRef,
                             }: EditPlanFormProps) {
    const {userId} = useAuth();
    const [connectedMealId, setConnectedMealId] = useState(existingPlan?.connectedMealId);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: "",
            date: "",
            hasDate: false,
            gotEverything: true,
        },
        validate: {
            title: (value) => (value.trim().length > 0 ? null : t("Your plan needs a title")),
        },
    });

    const hasDate = form.useWatchValue("hasDate");
    const currentTitle = form.useWatchValue("title");

    useEffect(() => {
        if (!existingPlan) return;

        form.initialize({
            title: existingPlan.title ?? "",
            date: existingPlan.date ?? "",
            hasDate: existingPlan.hasDate ?? false,
            gotEverything: existingPlan.gotEverything ?? true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingPlan]);

    useImperativeHandle(formRef, () => ({
        hasChanges: () => {
            const currentValues = form.getValues();

            return (
                currentValues.title !== (existingPlan?.title ?? "") ||
                currentValues.date !== (existingPlan?.date ?? "") ||
                currentValues.hasDate !== (existingPlan?.hasDate ?? false) ||
                currentValues.gotEverything !== (existingPlan?.gotEverything ?? true) ||
                connectedMealId !== (existingPlan?.connectedMealId ?? "")
            );
        }
    }));

    const handleSubmit = async (values: typeof form.values) => {
        if (!userId) return;

        setIsSaving(true);

        try {
            const planId = existingPlan?.id ?? crypto.randomUUID();

            if (existingPlan?.id) {
                await updatePlan(existingPlan.id, values);
            } else {
                await addPlan(userId, planId, values);
            }

            await syncEngine.runSync();
            onSuccess?.();
        } catch (error) {
            console.error("Failed to add plan:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleHasDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.currentTarget.checked;
        form.setFieldValue("hasDate", isChecked);

        if (isChecked && !form.getValues().date) {
            form.setFieldValue("date", new Date().toISOString().split("T")[0]);
        }
    };

    return (
        <form id="edit-plan-form" onSubmit={form.onSubmit(handleSubmit)} className="EditPlanForm">
            <TextInput // todo make autocomplete and deal with meal connection
                radius="sm"
                placeholder={t("Title")}
                withAsterisk
                className={connectedMealId ? classes.textInputWithImage : undefined}
                rightSection={
                    connectedMealId && <MealThumbnail
                        mealId={connectedMealId}
                        mealTitle={currentTitle}
                        thumbnailHeight={"100%"}
                        thumbnailWidth={"100%"}
                    />}
                rightSectionPointerEvents="none"
                key={form.key("title")}
                {...form.getInputProps("title")}
            />


            <Checkbox
                variant={"light"}
                label={t("Date")}
                key={form.key("hasDate")}
                {...form.getInputProps("hasDate", {type: "checkbox"})}
                onChange={handleHasDateChange}
            />

            {hasDate && (
                <DatePickerInput
                    key={form.key("date")}
                    {...form.getInputProps("date")}
                />
            )}

            <Checkbox
                variant={"light"}
                label={t("Got everything?")}
                key={form.key("gotEverything")}
                {...form.getInputProps("gotEverything", {type: "checkbox"})}
            />

            <Group justify="flex-end" mt="md">
                <Button loading={isSaving} type="submit">{t("Save Plan")}</Button>
            </Group>
        </form>
    );
}