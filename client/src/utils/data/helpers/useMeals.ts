import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';

export function useMeals(userId: string) {
    return useLiveQuery(async () => {
        const meals = await db.meals
            .where('userId')
            .equals(userId)
            .filter((m) => !m.isDeleted)
            .toArray();

        const [categories, allTags] = await Promise.all([
            db.categories.where('userId').equals(userId).filter((c) => !c.isDeleted).toArray(),
            db.tags.where('userId').equals(userId).filter((t) => !t.isDeleted).toArray(),
        ]);

        const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
        const tagMap = new Map(allTags.map((t) => [t.id, t.name]));

        return {
            meals,
            categoryMap,
            tagMap
        }
    }, [userId]);
}