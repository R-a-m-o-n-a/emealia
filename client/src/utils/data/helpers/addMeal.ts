import type {Meal, MealTagRelation} from "@emealia/shared";
import {db} from "../db";
import type {UpsertMealInput} from "./updateMeal.ts";

export async function addMeal(userId: string, mealId: string, input: UpsertMealInput): Promise<string> {
    const now = new Date().toISOString();

    const newMeal: Meal = {
        categoryId: input.categoryId || undefined,
        createdAt: now,
        freeText: input.freeText?.trim() || undefined,
        id: mealId,
        isDeleted: false,
        isPrivate: input.isPrivate ?? false,
        isToTry: input.isToTry ?? false,
        recipeLink: input.recipeLink?.trim() || undefined,
        syncStatus: "pending",
        title: input.title.trim(),
        updatedAt: now,
        userId,
        videoLink: input.videoLink?.trim() || undefined,
    };

    const tagIds = input.tagIds ?? [];

    if (tagIds.length === 0) {
        await db.meals.add(newMeal);
    } else {
        await db.transaction("rw", [db.meals, db.tags, db.mealTagRelations], async () => {
            await db.meals.add(newMeal);

            const relationsToInsert: MealTagRelation[] = [];

            for (const tagId of tagIds) {
                relationsToInsert.push({
                    userId,
                    syncStatus: "pending",
                    isDeleted: false,
                    updatedAt: now,
                    id: crypto.randomUUID(),
                    mealId,
                    tagId: tagId,
                    createdAt: now,
                });
            }

            if (relationsToInsert.length > 0) {
                await db.mealTagRelations.bulkAdd(relationsToInsert);
            }
        }).catch(err => console.error("Adding meal transaction failed:", err));
    }

    return mealId;
}