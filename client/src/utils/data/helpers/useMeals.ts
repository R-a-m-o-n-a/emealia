import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';

export function useMeals(userId: string) {
    return useLiveQuery(async () => {
        return await db.meals
            .where('userId')
            .equals(userId)
            .filter((m) => !m.isDeleted)
            .toArray();
    }, [userId]);
}