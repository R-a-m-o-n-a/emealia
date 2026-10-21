import {useLiveQuery} from 'dexie-react-hooks';
import {db} from "../db.ts";

export function useMainMealImage(mealId: string | undefined) {
    return useLiveQuery(async () => {
        if (!mealId) {
            return undefined;
        }
        
        const images = await db.mealImages
            .where('mealId')
            .equals(mealId)
            .filter((image) => !image.isDeleted)
            .toArray();

        return images.find((image) => image.isMain) ?? images[0];
    }, [mealId]);
}