import {useParams} from "react-router";
import {useMeal} from "../../../utils/data/helpers/useMeal.ts";

export function MealDetailPage() {
    const params = useParams();
    const {id: mealId} = params;
    const meal = useMeal(mealId);
    if (!meal) {
        return "Loading...";
    }
    return <h1>{meal.title}, {mealId}</h1>;
}
