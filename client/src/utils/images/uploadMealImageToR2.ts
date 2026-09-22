export async function uploadMealImageToR2(
    presignedPutUrl: string,
    compressedBlob: Blob
): Promise<boolean> {
    try {
        const response = await fetch(presignedPutUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': compressedBlob.type || 'image/webp',
            },
            body: compressedBlob,
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to upload image blob to R2:', error);
        return false;
    }
}