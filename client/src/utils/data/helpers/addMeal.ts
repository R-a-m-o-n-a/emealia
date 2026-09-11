import type {Meal, MealTagRelation} from "@emealia/shared";
import {db} from "../db";
import {addCategoryIfNew} from "./addCategoryIfNew";
import {addTagIfNew} from "./addTagIfNew";

export interface CreateMealInput {
    title: string;
    category?: string;
    freeText?: string;
    isPrivate?: boolean;
    isToTry?: boolean;
    tags?: string[];
    recipeLink?: string;
    videoLink?: string;
}

export async function addMeal(userId: string, input: CreateMealInput): Promise<string> {
    const mealId = crypto.randomUUID();
    const now = new Date().toISOString();

    // 1. Resolve Category ID if provided
    let categoryId: string | undefined = undefined;
    if (input.category && input.category.trim() !== "") {
        categoryId = await addCategoryIfNew(userId, input.category.trim());
    }

    // 2. Construct Meal object
    const newMeal: Meal = {
        id: mealId,
        userId,
        title: input.title.trim(),
        categoryId: categoryId || null,
        freeText: input.freeText?.trim() || null,
        isPrivate: input.isPrivate ?? false,
        isToTry: input.isToTry ?? false,
        link1: input.recipeLink?.trim() || null,
        link2: input.videoLink?.trim() || null,
        createdAt: now,
        updatedAt: now,
    };

    // 3. Process Tags & Relations in a transaction
    await db.transaction("rw", [db.meal, db.tag, db.mealTagRelation], async () => {
        // Add the meal row
        await db.meal.add(newMeal);

        // Process tag connections if tags exist
        if (input.tags && input.tags.length > 0) {
            for (const tagName of input.tags) {
                const trimmed = tagName.trim();
                if (!trimmed) continue;

                // Ensure tag exists and retrieve tagId
                const tagId = await addTagIfNew(userId, trimmed);

                if (tagId) {
                    const relation: MealTagRelation = {
                        id: crypto.randomUUID(),
                        mealId,
                        tagId,
                        createdAt: now,
                    };
                    await db.mealTagRelation.add(relation);
                }
            }
        }
    });

    return mealId;
}