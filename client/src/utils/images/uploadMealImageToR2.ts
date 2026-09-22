export async function uploadMealImageToR2(
    presignedPutUrl: string,
    compressedBlob: Blob
): Promise<boolean> {
    const response = await fetch(presignedPutUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'image/webp',
        },
        body: compressedBlob,
    });

    return response.ok;
}