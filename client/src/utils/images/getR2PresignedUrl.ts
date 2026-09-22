import {supabase} from "../data/supabase.ts";
import {ensureAuthentication} from "../user/getUserId.tsx";


export async function getR2PresignedUrl(
    r2Path: string
): Promise<{ signedUrl: string, publicUrl: string }> {
    await ensureAuthentication();

    const {data, error} = await supabase.functions.invoke('get-r2-upload-url', {
        body: {
            r2Path,
            action: 'putObject',
        },
    });

    if (error) {
        throw new Error(`Failed to get presigned upload URL: ${error.message}`);
    }

    return data;
}