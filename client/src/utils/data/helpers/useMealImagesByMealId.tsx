import {useLiveQuery} from 'dexie-react-hooks';
import {db} from "../db.ts";

export function useMealImagesByMealId(mealId: string | undefined) {
    return useLiveQuery(async () => {
        if (!mealId) {
            return undefined;
        }
        return await db.mealImages
            .where('mealId')
            .equals(mealId)
            .filter((image) => !image.isDeleted)
            .toArray();
    }, [mealId]);
}