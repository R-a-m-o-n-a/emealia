import type {LocalMealImage} from "@emealia/shared";
import {db} from "../db";

export interface ImagePositionUpdate {
    id: string;
    position: number;
    isMain: boolean;
}

export async function updateMealImageOrder(
    userId: string,
    mealId: string,
    updates: ImagePositionUpdate[]
): Promise<void> {
    const now = new Date().toISOString();

    await db.transaction("rw", db.mealImages, async () => {
        for (const update of updates) {
            const existing = await db.mealImages.get(update.id);
            if (existing && existing.userId === userId && existing.mealId === mealId) {
                const changes: Partial<LocalMealImage> = {
                    position: update.position,
                    isMain: update.isMain,
                    updatedAt: now,
                    syncStatus: "pending",
                };
                await db.mealImages.update(update.id, changes);
            }
        }
    });
}