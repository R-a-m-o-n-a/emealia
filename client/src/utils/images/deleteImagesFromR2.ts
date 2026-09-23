import {supabase} from "../data/supabase.ts";

export async function deleteImagesFromR2(r2Paths: string[]): Promise<void> {
    if (r2Paths.length === 0) return;

    const {error} = await supabase.functions.invoke("delete-meal-images", {
        body: {r2Paths},
    });

    if (error) {
        console.error("Failed to delete remote R2 images:", error);
        throw error;
    }
}