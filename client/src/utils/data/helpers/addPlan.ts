import type {Plan} from "@emealia/shared";
import {db} from "../db";
import {type UpsertPlanInput} from "./updatePlan.ts";

export async function addPlan(userId: string, planId: string, input: UpsertPlanInput): Promise<string> {
    const now = new Date().toISOString();

    const newPlan: Plan = {
        createdAt: now,
        id: planId,
        isDeleted: false,
        syncStatus: "pending",
        title: input.title.trim(),
        updatedAt: now,
        userId,
        date: input.date,
        hasDate: input.hasDate,
        gotEverything: input.gotEverything,
        connectedMealId: input.connectedMealId,
    };

    await db.plans.add(newPlan);

    return planId;
}