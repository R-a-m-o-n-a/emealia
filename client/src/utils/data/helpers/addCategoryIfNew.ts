import {v4 as uuidv4} from 'uuid';
import {db} from '../db';

export async function addCategoryIfNew(userId: string, categoryName: string): Promise<string> {
    const trimmed = categoryName.trim();
    if (!trimmed) return '';

    const existing = await db.categories
        .where('userId')
        .equals(userId)
        .filter((c) => !c.isDeleted && c.name.toLowerCase() === trimmed.toLowerCase())
        .first();

    if (existing) {
        return existing.id;
    }

    const now = new Date().toISOString();
    const newCategory = {
        id: uuidv4(),
        userId,
        name: trimmed,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
        syncStatus: 'pending' as const,
    };

    await db.categories.add(newCategory);
    return newCategory.id;
}