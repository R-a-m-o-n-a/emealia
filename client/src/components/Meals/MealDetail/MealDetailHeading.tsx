import classes from "./MealDetailHeading.module.css";

export function MealDetailHeading({category, title}: { category: string | undefined; title: string | undefined }) {
    return (
        <div className={classes.heading}>
            <div className={classes.category}>{category}</div>
            <h1 className={classes.title}>{title}</h1>
        </div>
    );
}
