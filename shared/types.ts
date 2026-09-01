export interface BaseSyncEntity {
    id: string; // UUID v4
    userId: string; // foreign key to auth.users
    createdAt: string; // ISO 8601 string
    updatedAt: string; // Required for conflict resolution
    syncStatus: 'synced' | 'pending' | 'syncing' | 'error';
    isDeleted: boolean;
}

export interface Category extends BaseSyncEntity {
    name: string;
}

export interface Tag extends BaseSyncEntity {
    name: string;
}

export interface MealImage extends BaseSyncEntity {
    mealId: string; // FK
    cloudflareId: string;
    height: number;
    width: number;
}

export interface MissingIngredient extends BaseSyncEntity {
    id: string;
    name: string;
    isChecked: boolean;
    planId: string;
}

export interface Meal extends BaseSyncEntity {
    title: string;
    recipeLink?: string;
    videoLink?: string;
    freeText?: string; // Supports Markdown formatting
    categoryId?: string; // Foreign key to Category
    isToTry?: boolean;
    isPrivate?: boolean;
    mainImageId?: string;
}

export interface Plan extends BaseSyncEntity {
    date?: string; // ISO Date string (YYYY-MM-DD)
    title: string;
    hasDate: boolean;
    gotEverything: boolean;
    connectedMealId?: string; // Foreign key to Meal
}

export interface UserSettings extends BaseSyncEntity {
    language: string; // e.g., 'en', 'de'
    prefersDarkMode: boolean;
}

export interface MealTagRelation extends BaseSyncEntity {
    mealId: string;
    tagId: string;
}
