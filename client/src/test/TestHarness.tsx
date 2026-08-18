import React, { useEffect, useState } from 'react';
import { createTestMeal, softDeleteMeal, updateMealTitle, } from './crudHelpers';
import { db } from "../utils/data/db.ts";
import { syncEngine } from "../utils/data/syncEngine.ts"; // Import the helpers created earlier

interface TestLog {
    id: string;
    time: string;
    type: 'info' | 'success' | 'error';
    message: string;
}

export const TestHarness: React.FC<{ userId: string }> = ({userId}) => {
    const [logs, setLogs] = useState<TestLog[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [dbStats, setDbStats] = useState({total: 0, dirty: 0, synced: 0});

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Refresh local Dexie stats live
    const refreshStats = async () => {
        const all = await db.meals.toArray();
        const dirty = all.filter((m) => m.syncStatus === 'dirty').length;
        const synced = all.filter((m) => m.syncStatus === 'synced').length;
        setDbStats({total: all.length, dirty, synced});
    };

    useEffect(() => {
        refreshStats();
        const interval = setInterval(refreshStats, 1000);
        return () => clearInterval(interval);
    }, []);

    const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        const newLog: TestLog = {
            id: crypto.randomUUID(),
            time: new Date().toLocaleTimeString(),
            type,
            message,
        };
        setLogs((prev) => [newLog, ...prev]);
    };

    // --- ACTIONS ---

    const handleManualSync = async () => {
        setIsSyncing(true);
        addLog('Starting manual sync cycle...', 'info');
        try {
            await syncEngine.runSync();
            addLog('Sync cycle completed successfully!', 'success');
        } catch (err: any) {
            addLog(`Sync failed: ${err.message}`, 'error');
        } finally {
            setIsSyncing(false);
            await refreshStats();
        }
    };

    const handleCreateMeal = async () => {
        const meal = await createTestMeal(userId, `Test Meal ${Date.now().toString().slice(-4)}`);
        addLog(`Created local record: "${meal.title}" (Status: ${meal.syncStatus})`, 'info');
        await refreshStats();
    };

    const handleRunFullPipelineTest = async () => {
        addLog('🚀 Starting Full Lifecycle Integration Test...', 'info');
        try {
            // 1. Create
            const meal = await createTestMeal(userId, `Pipeline Meal ${Date.now().toString().slice(-4)}`);
            addLog(`[Step 1] Created local meal: "${meal.title}" (dirty)`, 'info');

            // 2. Sync Create
            await syncEngine.runSync();
            let updatedMeal = await db.meals.get(meal.id);
            if (updatedMeal?.syncStatus !== 'synced') throw new Error('Create push failed');
            addLog('[Step 2] Pushed to Supabase -> syncStatus is now "synced"', 'success');

            // 3. Update
            await updateMealTitle(meal.id, `${meal.title} (Updated)`);
            addLog('[Step 3] Updated title locally -> syncStatus reverted to "dirty"', 'info');

            // 4. Sync Update
            await syncEngine.runSync();
            updatedMeal = await db.meals.get(meal.id);
            if (updatedMeal?.syncStatus !== 'synced') throw new Error('Update push failed');
            addLog('[Step 4] Pushed update to Supabase successfully!', 'success');

            // 5. Delete
            await softDeleteMeal(meal.id);
            addLog('[Step 5] Soft-deleted record locally (isDeleted: true)', 'info');

            // 6. Sync Delete
            await syncEngine.runSync();
            const purgedMeal = await db.meals.get(meal.id);
            if (purgedMeal) throw new Error('Local tombstone purge failed');
            addLog('[Step 6] Remote acknowledged delete -> Hard-deleted locally!', 'success');

            addLog('🎉 FULL PIPELINE TEST PASSED PERFECTLY!', 'success');
        } catch (err: any) {
            addLog(`❌ Test Pipeline Failed: ${err.message}`, 'error');
        } finally {
            await refreshStats();
        }
    };

    const handleClearDexie = async () => {
        await db.meals.clear();
        addLog('Cleared all records from local Dexie database.', 'info');
        await refreshStats();
    };

    return (
        <div style={styles.container}>
            <h2>🛠️ Sync & CRUD Test Harness</h2>

            {/* Status Bar */}
            <div style={styles.statusBar}>
                <span><strong>User ID:</strong> <code style={styles.code}>{userId}</code></span>
                <span>
          <strong>Network:</strong>{' '}
                    <span style={{color: isOnline ? '#2e7d32' : '#d32f2f', fontWeight: 'bold'}}>
            {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
          </span>
        </span>
            </div>

            {/* Dexie Live Counters */}
            <div style={styles.cardContainer}>
                <div style={styles.card}>
                    <div style={styles.cardValue}>{dbStats.total}</div>
                    <div style={styles.cardLabel}>Total Dexie Meals</div>
                </div>
                <div style={{...styles.card, borderColor: '#ed6c02'}}>
                    <div style={{...styles.cardValue, color: '#ed6c02'}}>{dbStats.dirty}</div>
                    <div style={styles.cardLabel}>Dirty (Pending Push)</div>
                </div>
                <div style={{...styles.card, borderColor: '#2e7d32'}}>
                    <div style={{...styles.cardValue, color: '#2e7d32'}}>{dbStats.synced}</div>
                    <div style={styles.cardLabel}>Synced</div>
                </div>
            </div>

            {/* Action Controls */}
            <div style={styles.buttonRow}>
                <button onClick={handleCreateMeal} style={styles.btnPrimary}>
                    + Create Test Meal
                </button>

                <button onClick={handleManualSync} disabled={isSyncing || !isOnline} style={isSyncing || !isOnline ? styles.btnDisabled : styles.btnSuccess}>
                    {isSyncing ? 'Syncing...' : '🔄 Run Sync Engine'}
                </button>

                <button onClick={handleRunFullPipelineTest} style={styles.btnPipeline}>
                    🧪 Run Full Auto Test
                </button>

                <button onClick={handleClearDexie} style={styles.btnDanger}>
                    🗑️ Clear Dexie
                </button>
            </div>

            {/* Event Console Logs */}
            <h3>Console Output</h3>
            <div style={styles.console}>
                {logs.length === 0 && <span style={{color: '#888'}}>No logs yet. Perform an action above!</span>}
                {logs.map((log) => (
                    <div key={log.id} style={styles.logLine}>
                        <span style={{color: '#888', marginRight: '8px'}}>[{log.time}]</span>
                        <span style={{
                            color: log.type === 'error' ? '#f44336' : log.type === 'success' ? '#4caf50' : '#e0e0e0',
                        }}>
              {log.message}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Embedded Inline Styles for Quick Setup ---
const styles: Record<string, React.CSSProperties> = {
    container: {padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto'},
    statusBar: {display: 'flex', justifyContent: 'space-between', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginBottom: '16px'},
    code: {background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px', fontSize: '12px'},
    cardContainer: {display: 'flex', gap: '16px', marginBottom: '20px'},
    card: {flex: 1, border: '2px solid #1976d2', borderRadius: '8px', padding: '12px', textAlign: 'center'},
    cardValue: {fontSize: '28px', fontWeight: 'bold', color: '#1976d2'},
    cardLabel: {fontSize: '12px', color: '#666', marginTop: '4px'},
    buttonRow: {display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px'},
    btnPrimary: {padding: '10px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'},
    btnSuccess: {padding: '10px 16px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'},
    btnPipeline: {padding: '10px 16px', backgroundColor: '#9c27b0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'},
    btnDanger: {padding: '10px 16px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'},
    btnDisabled: {padding: '10px 16px', backgroundColor: '#ccc', color: '#666', border: 'none', borderRadius: '4px', cursor: 'not-allowed'},
    console: {background: '#1e1e1e', color: '#fff', padding: '16px', borderRadius: '6px', height: '220px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px'},
    logLine: {marginBottom: '6px'},
};
