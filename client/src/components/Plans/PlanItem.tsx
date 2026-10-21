import type {Plan} from "@emealia/shared";
import {useNavigate} from "react-router";
import {MealThumbnail} from "../Meals/MealImage/MealThumbnail.tsx";

import classes from "./PlanItem.module.css"

export function PlanItem({plan}: { plan: Plan }) {
    const navigate = useNavigate();

    function openEdit() {
        navigate(`/plans/edit/${plan.id}`);
    }

    return (
        <div className={classes.planItem} onClick={openEdit}>
            {plan.title}
            {plan.connectedMealId && (
                <MealThumbnail mealId={plan.connectedMealId} mealTitle={plan.title} />
            )}
        </div>
    );
}
