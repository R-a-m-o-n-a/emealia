import type {LocalMealImage} from "@emealia/shared";
import {db} from "../db";

export interface UploadedImageItem {
    id: string;
    url: string;
    blob: Blob;
    position: number;
    isMain: boolean;
}

export async function addMealImages(
    userId: string,
    mealId: string,
    images: UploadedImageItem[]
): Promise<void> {
    const now = new Date().toISOString();

    const newMealImages: LocalMealImage[] = await Promise.all(
        images.map(async (img) => {
            const dimensions = await getImageDimensions(img.blob);

            return {
                createdAt: now,
                height: dimensions.height,
                id: img.id,
                isDeleted: false,
                isMain: img.isMain,
                localBlob: img.blob,
                mealId,
                position: img.position,
                publicUrl: img.url,
                r2DeletionStatus: "not_deleted",
                r2Path: `${userId}/meals/${mealId}/${img.id}.webp`,
                r2UploadStatus: "pending",
                sizeInBytes: img.blob.size,
                syncStatus: "pending",
                updatedAt: now,
                userId,
                width: dimensions.width,
            };
        })
    );

    if (newMealImages.length > 0) {
        await db.mealImages.bulkAdd(newMealImages);
    }
}

function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            resolve({width: img.width, height: img.height});
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            resolve({width: 0, height: 0});
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });
}
