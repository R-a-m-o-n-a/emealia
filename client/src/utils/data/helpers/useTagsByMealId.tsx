import {useLiveQuery} from 'dexie-react-hooks';
import {db} from "../db.ts";

export function useTagsByMealId(mealId: string | undefined) {
    return useLiveQuery(async () => {
        if (!mealId) {
            return undefined;
        }
        const mealTagRelations = await db.mealTagRelations
            .where('mealId')
            .equals(mealId)
            .filter((relation) => !relation.isDeleted)
            .toArray();

        const tagIds = mealTagRelations.map((relation) => relation.tagId);
        const tags = await db.tags.bulkGet(tagIds);

        return tags.filter((tag) => tag !== undefined);
    }, [mealId]);
}