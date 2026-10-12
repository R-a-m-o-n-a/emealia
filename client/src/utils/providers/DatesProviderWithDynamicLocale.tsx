import {DatesProvider} from '@mantine/dates';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';

type DayjsLocale = NonNullable<
    Exclude<Parameters<typeof dayjs.locale>[0], string>
>;

type LocaleModule = {
    default: DayjsLocale;
};

// Lazy: Vite creates a separate chunk for each locale.
// No locale module is downloaded or evaluated until its loader is called.
const localeLoaders = import.meta.glob(
    '../../../../node_modules/dayjs/esm/locale/*.js'
) as Record<string, () => Promise<LocaleModule>>;

function getBrowserLocale(): string {
    if (typeof window === 'undefined') {
        return 'en';
    }

    return (navigator.languages?.[0] ?? navigator.language ?? 'en')
        .toLowerCase()
        .replaceAll('_', '-');
}

async function registerLocale(locale: string): Promise<boolean> {
    // English is built into Day.js, so no separate locale chunk is required.
    if (locale === 'en') {
        return true;
    }

    const path = `../../../../node_modules/dayjs/esm/locale/${locale}.js`;
    const loadLocale = localeLoaders[path];

    if (!loadLocale) {
        return false;
    }

    const localeModule = await loadLocale();

    // The ESM locale registers itself with ESM Day.js. Register its locale
    // definition with the normal Day.js instance used by Mantine as well.
    dayjs.locale(localeModule.default, undefined, true);

    return true;
}

async function resolveAndRegisterLocale(browserLocale: string): Promise<string> {
    const baseLocale = browserLocale.split('-')[0];

    for (const candidate of [browserLocale, baseLocale, 'en']) {
        if (await registerLocale(candidate)) {
            return candidate;
        }
    }

    return 'en';
}

export function DatesProviderWithDynamicLocale({
                                                   children,
                                               }: {
    children: React.ReactNode;
}) {
    const [activeLocale, setActiveLocale] = useState('en');

    useEffect(() => {
        let cancelled = false;

        async function initializeLocale() {
            try {
                const locale = await resolveAndRegisterLocale(getBrowserLocale());

                if (cancelled) {
                    return;
                }

                // Optional for Mantine, but useful for application calls such as:
                // dayjs().format('L')
                dayjs.locale(locale);

                setActiveLocale(locale);
            } catch (error) {
                console.warn('Failed to load Day.js locale; using English.', error);

                if (!cancelled) {
                    dayjs.locale('en');
                    setActiveLocale('en');
                }
            }
        }

        void initializeLocale();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <DatesProvider settings={{locale: activeLocale}}>
            {children}
        </DatesProvider>
    );
}