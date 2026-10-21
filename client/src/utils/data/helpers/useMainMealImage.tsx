import {useLiveQuery} from 'dexie-react-hooks';
import {db} from "../db.ts";

export function useMainMealImage(mealId: string | undefined) {
    return useLiveQuery(async () => {
        if (!mealId) {
            return undefined;
        }
        return await db.mealImages
            .where('mealId')
            .equals(mealId)
            .filter((image) => !image.isDeleted && image.isMain)
            .first();
    }, [mealId]);
}