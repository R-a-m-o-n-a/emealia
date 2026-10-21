import type {Meal} from "@emealia/shared";
import {useNavigate} from "react-router";
import {MealThumbnail} from "../MealImage/MealThumbnail.tsx";

import classes from "./MealListItem.module.css";

export function MealListItem({meal}: { meal: Meal }) {
    const navigate = useNavigate();


    function openDetailPage() {
        navigate(`/meals/${meal.id}`, {state: {hasValidBackNavigation: true}});
    }

    return (
        <div className={classes.mealListItem} onClick={openDetailPage}>
            <MealThumbnail mealId={meal.id} mealTitle={meal.title} />
            {meal.title}
        </div>
    );
}
