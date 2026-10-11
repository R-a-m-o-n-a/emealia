import {DatesProvider} from '@mantine/dates';
import dayjs from 'dayjs';
// Import dayjs from the esm build path so glob can properly map it
import 'dayjs/esm/locale/en';
import {useEffect, useState} from 'react';
import 'dayjs/esm/locale/de';

const preloadedLocales = ['en', 'de'];

// Preload all dayjs locale modules eagerly using Vite's glob on the ESM path
const localeModules = import.meta.glob('../../../../node_modules/dayjs/esm/locale/*.js', {eager: true});

function getBrowserLocale(): string {
    if (typeof window === 'undefined') return 'en';
    const primaryLocale = navigator.languages?.[0] || navigator.language;
    return primaryLocale || 'en';
}

function loadDayjsLocale(locale: string): string {
    if (preloadedLocales.includes(locale)) {
        return locale;
    }

    const path = `../../../../node_modules/dayjs/esm/locale/${locale}.js`;

    if (localeModules[path]) {
        return locale;
    }

    // Try fallback to base language (e.g., 'fr' from 'fr-CA')
    const baseLocale = locale.split('-')[0];
    const basePath = `../../../../node_modules/dayjs/esm/locale/${baseLocale}.js`;

    if (baseLocale && baseLocale !== locale && localeModules[basePath]) {
        return baseLocale;
    }

    console.warn(`Locale '${locale}' not found, falling back to 'en'.`);
    return 'en';
}

export function DatesProviderWithDynamicLocale({children}: { children: React.ReactNode }) {
    const [activeLocale, setActiveLocale] = useState('en');

    useEffect(() => {
        const rawLocale = getBrowserLocale().toLowerCase();
        const resolvedLocale = loadDayjsLocale(rawLocale);

        // Ensure dayjs is globally synchronized with the locale
        dayjs.locale(resolvedLocale);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveLocale(resolvedLocale);
    }, []);

    console.log(activeLocale)
    // todo somehow even though the locale is recognized and seemingly loaded now, it does not reflect in the date component, it's always in en-US...
    return (
        <DatesProvider settings={{locale: activeLocale}}>
            {children}
        </DatesProvider>
    );
}