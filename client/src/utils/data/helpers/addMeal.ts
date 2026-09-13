import type {Meal, MealTagRelation} from "@emealia/shared";
import {db} from "../db";

export interface CreateMealInput {
    title: string;
    category?: string;
    freeText?: string;
    isPrivate?: boolean;
    isToTry?: boolean;
    categoryId?: string;
    tagNames?: string[];
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

    const tagNames = input.tagNames ?? [];

    if (tagNames.length === 0) {
        await db.meals.add(newMeal);
    } else {
        await db.transaction("rw", [db.meals, db.tags, db.mealTagRelations], async () => {
            await db.meals.add(newMeal);

            const foundTags = await db.tags.where("name").anyOf(tagNames).toArray();
            const foundTagMap = new Map(foundTags.map(tag => [tag.name, tag.id]));

            const relationsToInsert: MealTagRelation[] = [];

            for (const tagName of tagNames) {
                const tagId = foundTagMap.get(tagName);
                if (!tagId) {
                    console.error(`Tag "${tagName}" not found for meal ${mealId}`);
                } else {
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
            }

            if (relationsToInsert.length > 0) {
                await db.mealTagRelations.bulkAdd(relationsToInsert);
            }
        }).catch(err => console.error("Adding meal transaction failed:", err));
    }

    return mealId;
}