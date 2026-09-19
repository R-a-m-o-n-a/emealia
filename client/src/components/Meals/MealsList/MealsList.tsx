import "./MealsList.css";
import {useAuth} from "../../../contexts/AuthContext.tsx";
import {useMeals} from "../../../utils/data/helpers/useMeals.ts";
import {t} from "../../../utils/translate.ts";
import {CategorySectionHeader} from "./CategorySectionHeader.tsx";
import {MealListItem} from "./MealListItem.tsx";

const UNCATEGORIZED_KEY = '__uncategorized__';

export function MealsList() {
    const {userId} = useAuth();
    const result = useMeals(userId);

    if (!result) {
        return <div className="MealsList">Loading...</div>;
    }

    const {meals, categoryMap, tagMap} = result;
    tagMap.values(); // todo filters (added this line just to remove linting error of unused var for now

    const mealsByCategory = meals.reduce<Record<string, typeof meals>>((acc, meal) => {
        const categoryId = meal.categoryId ?? UNCATEGORIZED_KEY;
        acc[categoryId] = acc[categoryId] || [];
        acc[categoryId].push(meal);
        return acc;
    }, {});

    const sortedCategoryIds = Object.keys(mealsByCategory).sort((a, b) => {
        if (a === UNCATEGORIZED_KEY) return 1;
        if (b === UNCATEGORIZED_KEY) return -1;

        const nameA = categoryMap.get(a) ?? '';
        const nameB = categoryMap.get(b) ?? '';

        return nameA.localeCompare(nameB);
    });

    return (
        <div className="MealsList">
            {sortedCategoryIds.map((categoryId) => {
                const categoryName = categoryMap.get(categoryId) ?? t('Uncategorized');
                const categoryMeals = mealsByCategory[categoryId];

                return (
                    <section key={categoryId} className="MealsList-categoryGroup">
                        <CategorySectionHeader name={categoryName} id={categoryId}/>
                        {categoryMeals.map((meal) => (
                            <MealListItem key={meal.id} meal={meal}/>
                        ))}
                    </section>
                );
            })}
        </div>
    );
}