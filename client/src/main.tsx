import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index-dummy.css'
import {ensureAuthentication} from "./utils/user/getUserId.tsx";
import {syncEngine} from "./utils/data/syncEngine.ts";
import {registerSW} from 'virtual:pwa-register';
import {router} from "./router.tsx";
import '@mantine/core/styles.css';
import {RouterProvider} from "react-router/dom";
import {MantineProvider} from '@mantine/core';
import {theme} from './theme.ts';

try {
    if ('serviceWorker' in navigator) {
        registerSW({immediate: true});
    }
    await ensureAuthentication();
    syncEngine.runSync().catch(error => console.error('[Initial Sync Failed]', error));

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <MantineProvider theme={theme} defaultColorScheme={"auto"}>
                <RouterProvider router={router}/>
            </MantineProvider>
        </StrictMode>,
    )
} catch (error) {
    console.error('[Error on Application Start] Failed to initialize session:', error);
    // todo Show message "For the very first access to the application, you need an Internet connection"
}
