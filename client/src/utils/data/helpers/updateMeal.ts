import type {Meal, MealTagRelation} from "@emealia/shared";
import {db} from "../db.ts";

export interface UpsertMealInput {
    title: string;
    category?: string;
    freeText?: string;
    isPrivate?: boolean;
    isToTry?: boolean;
    categoryId?: string;
    tagIds?: string[];
    recipeLink?: string;
    videoLink?: string;
    mainImageId?: string;
}

export async function updateMeal(
    userId: string,
    mealId: string,
    input: UpsertMealInput
): Promise<void> {
    const now = new Date().toISOString();

    const mealUpdates: Partial<Meal> = {
        syncStatus: "pending",
        updatedAt: now,
    };

    if (input.title !== undefined) mealUpdates.title = input.title.trim();
    if (input.categoryId !== undefined) mealUpdates.categoryId = input.categoryId || undefined;
    if (input.freeText !== undefined) mealUpdates.freeText = input.freeText?.trim() || undefined;
    if (input.isPrivate !== undefined) mealUpdates.isPrivate = input.isPrivate;
    if (input.isToTry !== undefined) mealUpdates.isToTry = input.isToTry;
    if (input.recipeLink !== undefined) mealUpdates.recipeLink = input.recipeLink?.trim() || undefined;
    if (input.videoLink !== undefined) mealUpdates.videoLink = input.videoLink?.trim() || undefined;
    if (input.mainImageId !== undefined) mealUpdates.mainImageId = input.mainImageId?.trim() || undefined;

    await db.transaction("rw", [db.meals, db.tags, db.mealTagRelations], async () => {
        await db.meals.update(mealId, mealUpdates);

        if (input.tagIds !== undefined) {
            // Fetch existing active tag relations for this meal
            const existingRelations = await db.mealTagRelations
                .where({mealId, userId})
                .filter(r => !r.isDeleted)
                .toArray();

            const existingTagIdMap = new Map(existingRelations.map(r => [r.tagId, r]));
            const editedTagIds = new Set(input.tagIds);

            const relationsToRemove = existingRelations.filter(r => !editedTagIds.has(r.tagId));
            const tagIdsToAdd = input.tagIds.filter(tagId => !existingTagIdMap.has(tagId));

            if (relationsToRemove.length > 0) {
                const idsToRemove = relationsToRemove.map(r => r.id);
                await db.mealTagRelations
                    .where("id")
                    .anyOf(idsToRemove)
                    .modify({isDeleted: true, syncStatus: "pending", updatedAt: now});
            }

            if (tagIdsToAdd.length > 0) {
                const newRelations: MealTagRelation[] = tagIdsToAdd.map(tagId => ({
                    id: crypto.randomUUID(),
                    userId,
                    mealId,
                    tagId,
                    syncStatus: "pending",
                    isDeleted: false,
                    createdAt: now,
                    updatedAt: now,
                }));

                await db.mealTagRelations.bulkAdd(newRelations);
            }
        }
    }).catch(err => console.error("Updating meal transaction failed:", err));

}