import type {BaseSyncEntity} from '@emealia/shared';
import Dexie, {type UpdateSpec} from 'dexie';
import {processPendingImageUploads} from "../images/processPendingImageUploads.ts";
import {getUserId} from "../user/getUserId.tsx";
import {toCamelCase, toLowerSnakeCase} from "./caseUtils.ts";
import {db, EmealiaDB} from './db.ts';
import {supabase} from './supabase.ts';

const LAST_SYNC_KEY = 'emealia_last_synced_at';

const SYNC_TABLES: Array<{ local: keyof EmealiaDB; remote: string }> = [
    {local: 'userSettings', remote: 'user_settings'},
    {local: 'categories', remote: 'categories'},
    {local: 'tags', remote: 'tags'},
    {local: 'meals', remote: 'meals'},
    {local: 'plans', remote: 'plans'},
    {local: 'mealImages', remote: 'meal_images'},
    {local: 'missingIngredients', remote: 'missing_ingredients'},
    {local: 'mealTagRelations', remote: 'meal_tag_relations'},
];

export class SyncEngine {
    private isSyncing = false;

    async runSync(): Promise<void> {
        console.log('Sync engine running', {isSyncing: this.isSyncing, onLine: navigator.onLine});

        if (this.isSyncing || !navigator.onLine) return;

        this.isSyncing = true;

        const syncStartTime = new Date().toISOString();

        try {
            const userId = await getUserId();
            // PHASE 1: Upload binary files (Blobs in localMealImages) to R2 first
            // This uploads images to R2 and sets their publicUrl & r2Path on the local Dexie record
            await processPendingImageUploads(userId);

            // PHASE 2: Push database changes (parents -> children)
            for (const {local, remote} of SYNC_TABLES) {
                await this.pushTable(local, remote);
            }

            // PHASE 3: Pull remote database changes (parents -> children)
            for (const {local, remote} of SYNC_TABLES) {
                await this.pullTable(local, remote);
            }

            localStorage.setItem(LAST_SYNC_KEY, syncStartTime);
        } catch (error) {
            console.error('[SyncEngine] Sync failed:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    private async pushTable<T extends BaseSyncEntity>(
        localTable: keyof EmealiaDB,
        remoteTable: string
    ): Promise<void> {
        const table = db[localTable] as unknown as Dexie.Table<T, string>;

        const dirtyRecords = await table.where('syncStatus').equals('pending').toArray();
        if (dirtyRecords.length === 0) return;

        const dirtyRecordIds = dirtyRecords.map((r) => r.id);
        await table.bulkUpdate(
            dirtyRecordIds.map((id) => ({
                key: id,
                changes: {syncStatus: 'syncing'} as unknown as UpdateSpec<T>,
            }))
        );

        // Map camelCase to snake_case and exclude local-only sync fields (like syncStatus & localBlob)
        const payload = dirtyRecords.map((record) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {syncStatus, localBlob, r2UploadStatus, ...rest} = record as T & {
                localBlob?: Blob,
                r2UploadStatus?: string
            };
            return toLowerSnakeCase({...rest, updatedAt: new Date().toISOString()});
        });

        const {error} = await supabase.from(remoteTable).upsert(payload);

        if (error) {
            console.error(`[Push Error - ${remoteTable}]`, error);
            await table.bulkUpdate(
                dirtyRecordIds.map((id) => ({
                    key: id,
                    changes: {syncStatus: 'error'} as unknown as UpdateSpec<T>,
                }))
            );
            return;
        }

        // Clean up successfully synced records in Dexie
        await db.transaction('rw', table, async () => {
            for (const record of dirtyRecords) {
                if (record.isDeleted) {
                    await table.delete(record.id);
                } else {
                    await table.update(record.id, {syncStatus: 'synced'} as unknown as UpdateSpec<T>);
                }
            }
        });
    }

    private async pullTable<T extends BaseSyncEntity>(
        localTable: keyof EmealiaDB,
        remoteTable: string
    ): Promise<void> {
        const table = db[localTable] as unknown as Dexie.Table<T, string>;
        const lastSyncedAt = localStorage.getItem(LAST_SYNC_KEY) || new Date(0).toISOString();

        const {data: remoteRecords, error} = await supabase
            .from(remoteTable)
            .select('*')
            .gt('updated_at', lastSyncedAt);

        if (error || !remoteRecords || remoteRecords.length === 0) return;

        await db.transaction('rw', table, async () => {
            for (const rawRecord of remoteRecords) {
                const recordInCamelCase = toCamelCase<T>(rawRecord);
                const localRecord = await table.get(recordInCamelCase.id);

                if (localRecord && (localRecord.syncStatus === 'pending' || localRecord.syncStatus === 'syncing')) {
                    continue; // Local un-pushed changes take precedence
                }

                const syncedRecord = {
                    ...recordInCamelCase,
                    syncStatus: 'synced',
                } as unknown as T;

                if (syncedRecord.isDeleted) {
                    await table.delete(syncedRecord.id);
                } else {
                    await table.put(syncedRecord);
                }
            }
        });
    }
}

export const syncEngine = new SyncEngine();