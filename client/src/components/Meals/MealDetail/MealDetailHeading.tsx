import "./MealDetailHeading.css";

export function MealDetailHeading({category, title}: { category: string | undefined; title: string | undefined }) {
    return (
        <div className={"MealDetailHeading"}>
            <div className="MealDetailHeading-category">{category}</div>
            <h1 className="MealDetailHeading-title">{title}</h1>
        </div>
    );
}
