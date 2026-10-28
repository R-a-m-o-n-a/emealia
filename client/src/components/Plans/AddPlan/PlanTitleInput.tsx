import {CloseButton, Combobox, InputBase, useCombobox} from '@mantine/core';
import type {GetInputPropsReturnType} from '@mantine/form';
import Fuse from 'fuse.js';
import {useMemo} from 'react';
import {useAuth} from "../../../contexts/AuthContext.tsx";
import {useMeals} from "../../../utils/data/helpers/useMeals.ts";
import {t} from "../../../utils/translate.ts";
import {MealThumbnail} from "../../Meals/MealImage/MealThumbnail.tsx";

import classes from "./PlanTitleInput.module.css";

interface PlanTitleInputProps {
    value: string;
    onChange: (value: string) => void;
    connectedMealId: string | undefined;
    onMealSelect: (mealId: string | undefined) => void;
    titleInputProps?: GetInputPropsReturnType;
}

export function PlanTitleInput({
                                   value,
                                   onChange,
                                   connectedMealId,
                                   onMealSelect,
                                   titleInputProps,
                               }: PlanTitleInputProps) {

    const {userId} = useAuth();
    const rawMeals = useMeals(userId);
    const meals = useMemo(() => rawMeals ?? [], [rawMeals]);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const fuse = useMemo(() => {
        return new Fuse(meals, {
            keys: ['title'],
            threshold: 0.3,
            minMatchCharLength: 1,
        });
    }, [meals]);

    const filteredMeals = useMemo(() => {
        const trimmed = value.trim();
        if (!trimmed) return [];
        return fuse.search(trimmed).map((result) => result.item);
    }, [fuse, value]);

    function disconnectMeal() {
        onMealSelect(undefined);
    }

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(selectedMealId) => {
                const selectedMeal = meals.find((meal) => meal.id === selectedMealId);
                if (selectedMeal) {
                    onChange(selectedMeal.title);
                    onMealSelect(selectedMeal.id);
                }
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target>
                <InputBase
                    {...titleInputProps}
                    component="input"
                    radius="sm"
                    placeholder={t('Title')}
                    value={value}
                    onChange={(event) => {
                        const newValue = event.currentTarget.value;
                        onChange(newValue);

                        if (connectedMealId) {
                            disconnectMeal();
                        }

                        combobox.openDropdown();
                        combobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={
                        connectedMealId && (
                            <MealThumbnail
                                mealId={connectedMealId}
                                mealTitle={value}
                                thumbnailHeight="100%"
                                thumbnailWidth="100%"
                            />
                        )
                    }
                    rightSectionPointerEvents="none"
                />
            </Combobox.Target>
            {filteredMeals.length > 0 && (
                <Combobox.Dropdown>
                    <Combobox.Options>
                        {filteredMeals.map((meal) => {
                            const isSelected = meal.id === connectedMealId;

                            return (
                                <Combobox.Option value={meal.id} key={meal.id}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%'
                                    }}
                                    >
                                        <span>{meal.title}</span>
                                        {isSelected && (
                                            <CloseButton
                                                size="md"
                                                variant="subtle"
                                                color="gray"
                                                className={classes.xButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    disconnectMeal();
                                                }}
                                            />
                                        )}
                                    </div>
                                </Combobox.Option>
                            );
                        })}
                    </Combobox.Options>
                </Combobox.Dropdown>
            )}
        </Combobox>
    );
}