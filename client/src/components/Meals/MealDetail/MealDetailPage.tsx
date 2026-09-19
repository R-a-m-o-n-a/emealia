import {AiFillEyeInvisible} from "react-icons/ai";
import {BiSolidHourglassTop} from "react-icons/bi";
import {useParams} from "react-router";
import {useCategory} from "../../../utils/data/helpers/useCategory.ts";
import {useMeal} from "../../../utils/data/helpers/useMeal.ts";
import {useTagsByMealId} from "../../../utils/data/helpers/useTagsByMealId.tsx";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {EditButton} from "../../Buttons/EditButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {RecipeLink} from "../LinkButtons/RecipeLink.tsx";
import {VideoLink} from "../LinkButtons/VideoLink.tsx";
import {MealDetailHeading} from "./MealDetailHeading.tsx";
import {Tag} from "./Tag.tsx";

import "./MealDetailPage.css";

export function MealDetailPage() {
    const params = useParams();
    const {id: mealId} = params;
    const meal = useMeal(mealId);
    const category = useCategory(meal?.categoryId);
    const tags = useTagsByMealId(mealId);

    return (
        <>
            <Navbar>
                <BackButton/>
                <MealDetailHeading category={category?.name} title={meal?.title}/>
                <EditButton/>
            </Navbar>
            {meal && (
                <>
                    <div className={"MealDetailPage-links"}>
                        {meal?.videoLink && <VideoLink link={meal?.videoLink}/>}
                        {meal?.recipeLink && <RecipeLink link={meal?.recipeLink}/>}
                    </div>
                    <div className={"MealDetailPage-info"}>
                        {meal?.isPrivate && <span><AiFillEyeInvisible size={20}/></span>}
                        {meal?.isToTry && <span><BiSolidHourglassTop size={20}/></span>}
                        {tags && tags.map(tag => (<Tag key={tag.id} name={tag.name}/>))}
                    </div>
                    <div className={"MealDetailPage-text"}>
                        {meal?.freeText}
                    </div>
                </>
            )}
        </>
    );
}
