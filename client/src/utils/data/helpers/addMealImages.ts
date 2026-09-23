import type {LocalMealImage} from "@emealia/shared";
import {db} from "../db"; // import your Dexie db instance

export interface UploadedImageItem {
    id: string;
    url: string;
    blob: Blob;
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
                id: crypto.randomUUID(),
                userId,
                mealId,
                r2Path: `${userId}/meals/${mealId}/${img.id}.webp`,
                r2UploadStatus: "pending",
                publicUrl: img.url, // will be replaced with publicUrl once edge function returns it
                localBlob:
                img.blob,
                height:
                dimensions.height,
                width:
                dimensions.width,
                sizeInBytes:
                img.blob.size,
                syncStatus:
                    "pending",
                isDeleted:
                    false,
                createdAt:
                now,
                updatedAt:
                now,
            }
                ;
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
