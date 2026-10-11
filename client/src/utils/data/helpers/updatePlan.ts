import type {Plan} from "@emealia/shared";
import {db} from "../db.ts";

export interface UpsertPlanInput {
    title: string;
    date?: string;
    hasDate: boolean;
    gotEverything: boolean;
    connectedMealId?: string;
}

export async function updatePlan(
    planId: string,
    input: UpsertPlanInput
): Promise<void> {
    const now = new Date().toISOString();

    const planUpdates: Partial<Plan> = {
        syncStatus: "pending",
        updatedAt: now,
    };

    planUpdates.title = input.title?.trim();
    planUpdates.date = input.date;
    planUpdates.hasDate = input.hasDate;
    planUpdates.gotEverything = input.gotEverything;
    planUpdates.connectedMealId = input.connectedMealId;

    await db.plans.update(planId, planUpdates);
}