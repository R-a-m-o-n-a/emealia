import { useLoaderData, useParams } from "react-router";

export function MealDetailPage() {
    let params = useParams();
    let data = useLoaderData();
    const {id: mealId} = params;
    return <h1>{data.mealId}, {mealId}</h1>;
}
