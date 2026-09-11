import {db} from '../db';

export async function addCategoryIfNew(userId: string, categoryName: string): Promise<string> {
    const trimmed = categoryName.trim();

    if (!trimmed) {
        console.error("Trying to create empty category");
        return '';
    }

    if (!userId) {
        console.error("Trying to create category for unknown userId");
        return '';
    }

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
        id: crypto.randomUUID(),
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