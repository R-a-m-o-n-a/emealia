import {v4 as uuidv4} from 'uuid';
import {db} from '../db';

export async function addTagIfNew(userId: string, tagName: string): Promise<string> {
    const trimmedInput = tagName.trim();
    if (!trimmedInput) return '';

    // 1. Check if tag exists (case-insensitive)
    const existingTag = await db.tags
        .where('userId')
        .equals(userId)
        .filter((t) => !t.isDeleted && t.name.toLowerCase() === trimmedInput.toLowerCase())
        .first();

    if (existingTag) {
        return existingTag.id;
    }

    // 2. Create new tag if missing
    const now = new Date().toISOString();
    const newTag = {
        id: uuidv4(),
        userId,
        name: trimmedInput,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
        syncStatus: 'pending' as const,
    };

    await db.tags.add(newTag);
    return newTag.id;
}