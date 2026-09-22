import {db} from "../data/db.ts";
import {getBatchR2PresignedUrls} from "./getR2PresignedUrl.ts";
import {uploadMealImageToR2} from "./uploadMealImageToR2.ts";

export async function processPendingImageUploads(userId: string) {
    const pendingImages = await db.mealImages
        .where('userId')
        .equals(userId)
        .filter((img) => img.r2UploadStatus === 'pending' && !img.isDeleted && Boolean(img.localBlob))
        .toArray();

    if (pendingImages.length === 0) return;

    const pendingIds = pendingImages.map((img) => img.id);
    await db.mealImages.where('id').anyOf(pendingIds).modify({r2UploadStatus: 'uploading'});

    try {
        const payload = pendingImages.map((img) => ({
            r2Path: img.r2Path,
            contentType: img.localBlob?.type || 'image/webp',
        }));

        const urlMap = await getBatchR2PresignedUrls(payload);

        const uploadPromises = pendingImages.map(async (imageRecord) => {
            const {localBlob, r2Path, id} = imageRecord;
            if (!localBlob) return;

            const presignedData = urlMap[r2Path];
            if (!presignedData) {
                await db.mealImages.update(id, {r2UploadStatus: 'error'});
                return;
            }

            const isSuccess = await uploadMealImageToR2(presignedData.signedUrl, localBlob);

            if (isSuccess) {
                await db.mealImages.update(id, {
                    r2UploadStatus: 'uploaded',
                    publicUrl: presignedData.publicUrl,
                    localBlob: undefined, // Clear Blob from Dexie
                    updatedAt: new Date().toISOString(),
                });
            } else {
                await db.mealImages.update(id, {r2UploadStatus: 'error'});
            }
        });

        await Promise.allSettled(uploadPromises);
    } catch (error) {
        console.error('Failed batch upload to R2:', error);
        await db.mealImages.where('id').anyOf(pendingIds).modify({r2UploadStatus: 'error'});
    }
}