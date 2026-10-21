import type {Meal} from "@emealia/shared";
import {useNavigate} from "react-router";
import {MainMealImage} from "../MealImage/MainMealImage.tsx";

import classes from "./MealListItem.module.css";

export function MealListItem({meal}: { meal: Meal }) {
    const navigate = useNavigate();


    function openDetailPage() {
        navigate(`/meals/${meal.id}`, {state: {hasValidBackNavigation: true}});
    }

    return (
        <div className={classes.mealListItem} onClick={openDetailPage}>
            <MainMealImage mealId={meal.id} mealTitle={meal.title} />
            {meal.title}
        </div>
    );
}
