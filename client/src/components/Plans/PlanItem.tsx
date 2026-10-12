import type {Plan} from "@emealia/shared";

export function PlanItem({plan}: { plan: Plan }) {
    return (
        <>
            {plan.title}
        </>
    );
}
