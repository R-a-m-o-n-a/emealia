import type {
    Category,
    Meal,
    MealImage,
    MealTagRelation,
    MissingIngredient,
    Plan,
    Tag,
    UserSettings
} from '@emealia/shared';
import type {Table} from 'dexie';
import Dexie from 'dexie';

export class EmealiaDB extends Dexie {
    categories!: Table<Category>;
    tags!: Table<Tag>;
    mealImages!: Table<MealImage>;
    missingIngredients!: Table<MissingIngredient>;
    meals!: Table<Meal>;
    plans!: Table<Plan>;
    userSettings!: Table<UserSettings>;
    mealTagRelations!: Table<MealTagRelation>;

    constructor() {
        super('MealPlannerDB');

        // Index only fields needed for primary keys, foreign keys, and fast sync queries
        this.version(1).stores({
            categories: '&id, userId, syncStatus, updatedAt',
            tags: '&id, userId, syncStatus, updatedAt',
            mealImages: '&id, userId, mealId, syncStatus, updatedAt',
            missingIngredients: '&id, userId, planId, syncStatus, updatedAt',
            meals: '&id, userId, categoryId, syncStatus, updatedAt',
            plans: '&id, userId, connectedMealId, date, syncStatus, updatedAt',
            userSettings: '&id, userId, syncStatus, updatedAt',
            mealTagRelations: '&id, userId, mealId, tagId, [mealId+tagId], syncStatus, updatedAt'
        });
    }
}

export const db = new EmealiaDB();
