import {supabase} from "../data/supabase.ts";
import {ensureAuthentication} from "../user/getUserId.tsx";

export interface PresignedUrlResult {
    signedUrl: string;
    publicUrl: string;
}

export interface BatchItemPayload {
    r2Path: string;
    contentType?: string;
}

/**
 * Fetch a single presigned upload URL.
 */
export async function getR2PresignedUrl(
    r2Path: string,
    contentType: string = 'image/webp'
): Promise<PresignedUrlResult> {
    const map = await getBatchR2PresignedUrls([{r2Path, contentType}]);
    const result = map[r2Path];

    if (!result) {
        throw new Error(`Failed to retrieve presigned URL for path: ${r2Path}`);
    }

    return result;
}

/**
 * Fetch multiple presigned upload URLs in a single Edge Function request.
 * Returns a map indexed by r2Path for O(1) lookup.
 */
export async function getBatchR2PresignedUrls(
    items: BatchItemPayload[]
): Promise<Record<string, PresignedUrlResult>> {
    if (items.length === 0) return {};

    await ensureAuthentication();

    const {data, error} = await supabase.functions.invoke('get-r2-upload-url', {
        body: {items},
    });

    if (error) {
        throw new Error(`Failed to get presigned upload URLs: ${error.message}`);
    }

    // Transform array response [{ r2Path, signedUrl, publicUrl }] into a lookup map { [r2Path]: { signedUrl, publicUrl } }
    const urlMap: Record<string, PresignedUrlResult> = {};
    if (Array.isArray(data?.urls)) {
        for (const item of data.urls) {
            urlMap[item.r2Path] = {
                signedUrl: item.signedUrl,
                publicUrl: item.publicUrl,
            };
        }
    }

    return urlMap;
}