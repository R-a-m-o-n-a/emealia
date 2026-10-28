import {MantineProvider} from '@mantine/core';
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router/dom";
import {registerSW} from 'virtual:pwa-register';
import {AuthProvider} from "./contexts/AuthContext.tsx";
import {router} from "./router.tsx";
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css'; // ‼️ import dropzone styles after core package styles
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import {theme} from './theme/theme.ts';
import {syncEngine} from "./utils/data/syncEngine.ts";
import {DatesProviderWithDynamicLocale} from "./utils/providers/DatesProviderWithDynamicLocale.tsx";
import {ensureAuthentication} from "./utils/user/getUserId.tsx";

try {
    if ('serviceWorker' in navigator) {
        registerSW({immediate: true});
    }
    await ensureAuthentication();
    syncEngine.runSync().catch(error => console.error('[Initial Sync Failed]', error));

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <AuthProvider>
                <MantineProvider theme={theme} defaultColorScheme={"auto"}>
                    <DatesProviderWithDynamicLocale>
                        <RouterProvider router={router} />
                    </DatesProviderWithDynamicLocale>
                </MantineProvider>
            </AuthProvider>
        </StrictMode>,
    )
} catch (error) {
    console.error('[Error on Application Start] Failed to initialize session:', error);
    // todo Show message "For the very first access to the application, you need an Internet connection"
}
