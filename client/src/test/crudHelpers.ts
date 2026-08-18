import type { Meal } from "@emealia/shared";
import { db } from "../utils/data/db.ts";

// CREATE

export async function createTestMeal(userId: string, title: string): Promise<Meal> {
    const newMeal: Meal = {
        id: crypto.randomUUID(),
        userId,
        title,
        syncStatus: 'dirty',
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await db.meals.add(newMeal);
    return newMeal;
}

// READ (Filter out local tombstones)
export async function getActiveMeals(): Promise<Meal[]> {
    return await db.meals
        .filter((meal) => !meal.isDeleted)
        .toArray();
}

// UPDATE
export async function updateMealTitle(id: string, newTitle: string): Promise<void> {
    await db.meals.update(id, {
        title: newTitle,
        syncStatus: 'dirty',
        updatedAt: new Date().toISOString(),
    });
}

// DELETE (Soft-delete / Tombstone)
export async function softDeleteMeal(id: string): Promise<void> {
    await db.meals.update(id, {
        isDeleted: true,
        syncStatus: 'dirty',
        updatedAt: new Date().toISOString(),
    });
}
