import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';

export function usePlan(planId: string | undefined) {
    return useLiveQuery(async () => {
        if (!planId) {
            return undefined;
        }
        return await db.plans
            .where('id')
            .equals(planId)
            .filter((m) => !m.isDeleted)
            .first();
    }, [planId]);
}