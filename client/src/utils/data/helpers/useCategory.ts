import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';

export function useCategory(categoryId: string | undefined) {
    return useLiveQuery(async () => {
        if (!categoryId) {
            return undefined;
        }
        return await db.categories
            .where('id')
            .equals(categoryId)
            .filter((category) => !category.isDeleted)
            .first();
    }, [categoryId]);
}