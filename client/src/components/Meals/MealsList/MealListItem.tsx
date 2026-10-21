import type {Meal} from "@emealia/shared";
import {useNavigate} from "react-router";

import classes from "./MealListItem.module.css";

export function MealListItem({meal}: { meal: Meal }) {
    const navigate = useNavigate();

    function openDetailPage() {
        navigate(`/meals/${meal.id}`, {state: {hasValidBackNavigation: true}});
    }

    return (
        <div className={classes.MealListItem} onClick={openDetailPage}>
            {meal.title}
        </div>
    );
}
