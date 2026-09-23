import type {LocalMealImage} from "@emealia/shared";
import {db} from "../data/db.ts";
import {supabase} from "../data/supabase.ts";

export async function processPendingImageDeletions(userId: string): Promise<void> {
    const pendingDeletions = await db.mealImages
        .where("userId")
        .equals(userId)
        .filter((img: LocalMealImage) =>
            img.isDeleted &&
            img.syncStatus === "pending" &&
            img.r2DeletionStatus !== "deleted"
        )
        .toArray();

    if (pendingDeletions.length === 0) return;

    const ids = pendingDeletions.map((img) => img.id);
    const r2Paths = pendingDeletions
        .map((img) => img.r2Path)
        .filter((path): path is string => Boolean(path));

    if (r2Paths.length === 0) return;

    await db.mealImages
        .where("id")
        .anyOf(ids)
        .modify({r2DeletionStatus: "deleting"});

    try {
        const {error} = await supabase.functions.invoke("delete-meal-images", {
            body: {r2Paths},
        });

        if (error) {
            console.error("[SyncEngine] Edge Function deletion failed:", error);
            await db.mealImages
                .where("id")
                .anyOf(ids)
                .modify({r2DeletionStatus: "error"});
            return;
        }

        await db.mealImages
            .where("id")
            .anyOf(ids)
            .modify({r2DeletionStatus: "deleted"});

    } catch (err) {
        console.error("[SyncEngine] Failed to delete images from R2:", err);
        await db.mealImages
            .where("id")
            .anyOf(ids)
            .modify({r2DeletionStatus: "error"});
    }
}