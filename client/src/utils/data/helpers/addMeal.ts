import type {Meal, MealTagRelation} from "@emealia/shared";
import {db} from "../db";

export interface CreateMealInput {
    title: string;
    category?: string;
    freeText?: string;
    isPrivate?: boolean;
    isToTry?: boolean;
    categoryId?: string;
    tagIds?: string[];
    recipeLink?: string;
    videoLink?: string;
}

export async function addMeal(userId: string, input: CreateMealInput): Promise<string> {
    const mealId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newMeal: Meal = {
        id: mealId,
        isDeleted: false,
        syncStatus: "pending",
        userId,
        title: input.title.trim(),
        categoryId: input.categoryId || undefined,
        freeText: input.freeText?.trim() || undefined,
        isPrivate: input.isPrivate ?? false,
        isToTry: input.isToTry ?? false,
        recipeLink: input.recipeLink?.trim() || undefined,
        videoLink: input.videoLink?.trim() || undefined,
        createdAt: now,
        updatedAt: now
    };

    await db.transaction("rw", [db.meals, db.tags, db.mealTagRelations], async () => {
        await db.meals.add(newMeal);

        if (input.tagIds && input.tagIds.length > 0) {
            for (const tagId of input.tagIds) {
                const relation: MealTagRelation = {
                    userId,
                    syncStatus: "pending",
                    isDeleted: false,
                    updatedAt: now,
                    id: crypto.randomUUID(),
                    mealId,
                    tagId,
                    createdAt: now,
                };
                await db.mealTagRelations.add(relation);
            }
        }
    });

    return mealId;
}