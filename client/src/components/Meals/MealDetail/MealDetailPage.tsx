import {AiFillEyeInvisible} from "react-icons/ai";
import {BiSolidHourglassTop} from "react-icons/bi";
import {useLocation, useNavigate, useParams} from "react-router";
import {useCategory} from "../../../utils/data/helpers/useCategory.ts";
import {useMeal} from "../../../utils/data/helpers/useMeal.ts";
import {useTagsByMealId} from "../../../utils/data/helpers/useTagsByMealId.tsx";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {EditButton} from "../../Buttons/EditButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {RecipeLink} from "../LinkButtons/RecipeLink.tsx";
import {VideoLink} from "../LinkButtons/VideoLink.tsx";
import {InfoIcon} from "./InfoIcon.tsx";
import {MealDetailHeading} from "./MealDetailHeading.tsx";
import {Tag} from "./Tag.tsx";

import "./MealDetailPage.css";

export function MealDetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const {id: mealId} = params;
    const meal = useMeal(mealId);
    const category = useCategory(meal?.categoryId);
    const tags = useTagsByMealId(mealId);

    function navigateToEdit() {
        navigate(`/meals/edit/${mealId}`, {state: {fromDetails: true}});
    }

    function navigateBackOrToMeals() {
        if (location.state?.hasValidBackNavigation) {
            navigate(-1);
        } else {
            navigate('/meals');
        }
    }

    return (
        <>
            <Navbar>
                <BackButton onClickOverwrite={navigateBackOrToMeals} />
                <MealDetailHeading category={category?.name} title={meal?.title} />
                <EditButton onClick={navigateToEdit} />
            </Navbar>
            {meal && (
                <>
                    <div className={"MealDetailPage-links"}>
                        {meal?.videoLink && <VideoLink link={meal?.videoLink} />}
                        {meal?.recipeLink && <RecipeLink link={meal?.recipeLink} />}
                    </div>
                    <div className={"MealDetailPage-info"}>
                        {meal?.isPrivate && <InfoIcon Icon={AiFillEyeInvisible} />}
                        {(meal?.isPrivate && meal?.isToTry) && <div className={"separatorLine"} />}
                        {meal?.isToTry && <InfoIcon Icon={BiSolidHourglassTop} />}
                        {(meal?.isToTry && !!tags?.length) && <div className={"separatorLine"} />}
                        {!!tags?.length && tags.map(tag => (<Tag key={tag.id} name={tag.name} />))}
                    </div>
                    <div className={"MealDetailPage-text"}>
                        {meal?.freeText}
                    </div>
                </>
            )}
        </>
    );
}
