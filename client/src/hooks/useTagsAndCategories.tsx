import type {Category, Tag} from "@emealia/shared";
import {useLiveQuery} from 'dexie-react-hooks';
import {db} from "../utils/data/db.ts";

export function useTagsAndCategories(userId: string) {
    return useLiveQuery(async (): Promise<{ categories: Category[]; tags: Tag[] }> => {
        if (!userId) return {categories: [], tags: []};

        const [categories, tags] = await Promise.all([
            db.categories
                .where('userId')
                .equals(userId)
                .filter((cat) => !cat.isDeleted)
                .toArray(),
            db.tags
                .where('userId')
                .equals(userId)
                .filter((tag) => !tag.isDeleted)
                .toArray(),
        ]);

        return {
            categories,//: categories.sort((a: Category, b: Category) => a.name.localeCompare(b.name)),
            tags,//: tags.sort((a: Tag, b: Tag) => a.name.localeCompare(b.name)),
        };
    }, [userId]);
}