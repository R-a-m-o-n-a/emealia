import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';

export function useMeal(mealId: string | undefined) {
    return useLiveQuery(async () => {
        if (!mealId) {
            return undefined;
        }
        return await db.meals
            .where('id')
            .equals(mealId)
            .filter((m) => !m.isDeleted)
            .first();
    }, [mealId]);
}