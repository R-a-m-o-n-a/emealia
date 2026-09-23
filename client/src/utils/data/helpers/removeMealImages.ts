import {db} from "../db";

export async function removeMealImages(
    userId: string,
    mealId: string,
    imageIds: string[]
): Promise<void> {
    if (imageIds.length === 0) return;

    const now = new Date().toISOString();

    await db.mealImages
        .where("id")
        .anyOf(imageIds)
        .modify((image) => {
            if (image.userId === userId && image.mealId === mealId) {
                image.isDeleted = true;
                image.syncStatus = "pending";
                image.updatedAt = now;
            }
        });
}