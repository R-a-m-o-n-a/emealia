import type {Meal} from "@emealia/shared";
import {useNavigate} from "react-router";
import "./MealListItem.css";

export function MealListItem({meal}: { meal: Meal }) {
    const navigate = useNavigate();

    function openDetailPage() {
        navigate(`/meals/${meal.id}`);
    }

    return (
        <div className="MealListItem" onClick={openDetailPage}>
            {meal.title}
        </div>
    );
}
