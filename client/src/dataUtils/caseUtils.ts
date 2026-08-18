export const toCamelCase = <T = any>(obj: Record<string, any>): T => {
    if (Array.isArray(obj)) return obj.map(toCamelCase) as any;
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            acc[camelKey] = obj[key];
            return acc;
        }, {} as any);
    }
    return obj as T;
};

export const toLowerSnakeCase = <T = any>(obj: Record<string, any>): T => {
    if (Array.isArray(obj)) return obj.map(toLowerSnakeCase) as any;
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
            acc[snakeKey] = obj[key];
            return acc;
        }, {} as any);
    }
    return obj as T;
};
