import {db} from "../data/db.ts";
import {getR2PresignedUrl} from "./getR2PresignedUrl.ts";
import {uploadMealImageToR2} from "./uploadMealImageToR2.ts";

export async function processPendingImageUploads(userId: string) {
    const pendingImages = await db.mealImages
        .where('userId')
        .equals(userId)
        .filter((img) => img.r2UploadStatus === 'pending' && !img.isDeleted && Boolean(img.localBlob))
        .toArray();

    for (const imageRecord of pendingImages) {
        if (!imageRecord.localBlob) continue;

        try {
            await db.mealImages.update(imageRecord.id, {r2UploadStatus: 'uploading'});

            const data = await getR2PresignedUrl(
                imageRecord.r2Path
            );

            const {signedUrl, publicUrl} = data;

            const hasCloudflareUploadBeenSuccessful = await uploadMealImageToR2(signedUrl, imageRecord.localBlob);

            if (hasCloudflareUploadBeenSuccessful) {
                await db.mealImages.update(imageRecord.id, {
                    r2UploadStatus: 'pending',
                    publicUrl,
                    localBlob: undefined, // Clears heavy byte storage from local IndexedDB
                    updatedAt: new Date().toISOString(),
                });
            } else {
                await db.mealImages.update(imageRecord.id, {r2UploadStatus: 'error'});
            }
        } catch (error) {
            console.error(`Failed to upload image ${imageRecord.id} to R2:`, error);
            await db.mealImages.update(imageRecord.id, {r2UploadStatus: 'error'});
        }
    }
}
