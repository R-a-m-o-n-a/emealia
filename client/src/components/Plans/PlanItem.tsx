import type {Plan} from "@emealia/shared";
import {useNavigate} from "react-router";

export function PlanItem({plan}: { plan: Plan }) {
    const navigate = useNavigate();

    function openEdit() {
        navigate(`/plans/edit/${plan.id}`);
    }

    return (
        <div onClick={openEdit}>
            {plan.title}
        </div>
    );
}
