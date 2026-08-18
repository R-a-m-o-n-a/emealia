import { useEffect } from 'react';
import { syncEngine } from './utils/data/syncEngine.ts';

export function useSyncManager() {
    useEffect(() => {
        // Sync immediately on mount
        syncEngine.runSync();

        const handleOnline = () => syncEngine.runSync();
        window.addEventListener('online', handleOnline);

        return () => window.removeEventListener('online', handleOnline);
    }, []);
}
