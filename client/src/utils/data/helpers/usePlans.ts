import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';

export function usePlans(userId: string) {
    return useLiveQuery(async () => {
        return await db.plans
            .where('userId')
            .equals(userId)
            .filter((m) => !m.isDeleted)
            .toArray();
    }, [userId]);
}