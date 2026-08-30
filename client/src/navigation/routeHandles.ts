/**
 * Serializable route metadata consumed by layout chrome (navbar, breadcrumbs, etc.).
 * Keep values JSON-safe — no functions or component references.
 */
export type AppRouteHandle = {
    /** Show the app menu button instead of back navigation. */
    showAppMenu?: boolean;
};
