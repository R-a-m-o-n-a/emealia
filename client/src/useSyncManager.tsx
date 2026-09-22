import {useEffect} from 'react';
import {syncEngine} from './utils/data/syncEngine.ts';

export function useSyncManager(intervalMs = 30000) {
    useEffect(() => {
        syncEngine.runSync();

        const intervalId = window.setInterval(() => {
            syncEngine.runSync();
        }, intervalMs);

        const handleOnline = () => syncEngine.runSync();
        window.addEventListener('online', handleOnline);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('online', handleOnline);
        };
    }, [intervalMs]);
}