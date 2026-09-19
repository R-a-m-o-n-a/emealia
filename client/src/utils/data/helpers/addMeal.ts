import type {Meal, MealTagRelation} from "@emealia/shared";
import {db} from "../db";
import {syncEngine} from "../syncEngine.ts";
import type {UpsertMealInput} from "./updateMeal.ts";

export async function addMeal(userId: string, input: UpsertMealInput): Promise<string> {
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

    syncEngine.runSync().catch((err) => {
        console.log(err)
    }).then(() => {
        console.log("Sync done");
    });

    return mealId;
}