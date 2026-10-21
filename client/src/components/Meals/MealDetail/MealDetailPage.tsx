import {useState} from "react";
import {AiFillEyeInvisible} from "react-icons/ai";
import {BiSolidHourglassTop} from "react-icons/bi";
import {useLocation, useNavigate, useParams} from "react-router";
import {useCategory} from "../../../utils/data/helpers/useCategory.ts";
import {useMeal} from "../../../utils/data/helpers/useMeal.ts";
import {useMealImagesByMealId} from "../../../utils/data/helpers/useMealImagesByMealId.tsx";
import {useTagsByMealId} from "../../../utils/data/helpers/useTagsByMealId.tsx";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {EditButton} from "../../Buttons/EditButton.tsx";
import {PlanButton} from "../../Buttons/PlanButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {RecipeLink} from "../LinkButtons/RecipeLink.tsx";
import {VideoLink} from "../LinkButtons/VideoLink.tsx";
import {CarouselModal} from "../MealImage/CarouselModal.tsx";
import {MealImageGrid} from "../MealImage/MealImageGrid/MealImageGrid.tsx";
import {MealImageGridImage} from "../MealImage/MealImageGrid/MealImageGridImage.tsx";
import {InfoIcon} from "./InfoIcon.tsx";
import {MealDetailHeading} from "./MealDetailHeading.tsx";

import classes from "./MealDetailPage.module.css";
import {Tag} from "./Tag.tsx";

export function MealDetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const {id: mealId} = params;
    const meal = useMeal(mealId);
    const category = useCategory(meal?.categoryId);
    const tags = useTagsByMealId(mealId);
    const mealImages = useMealImagesByMealId(mealId);

    const [carouselStartIndex, setCarouselStartIndex] = useState(0);
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);

    function navigateToEdit() {
        navigate(`/meals/edit/${mealId}`, {state: {fromDetails: true, meal, tags, category, mealImages}});
    }

    function navigateBackOrToMeals() {
        if (location.state?.hasValidBackNavigation) {
            navigate(-1);
        } else {
            navigate('/meals');
        }
    }

    function openCarousel(index: number) {
        setCarouselStartIndex(index);
        setIsCarouselOpen(true);
    }

    function closeCarousel() {
        setIsCarouselOpen(false);
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
                    <div>
                        {meal?.videoLink && <VideoLink link={meal?.videoLink} />}
                        {meal?.recipeLink && <RecipeLink link={meal?.recipeLink} />}
                    </div>
                    <div className={classes.info}>
                        {meal?.isPrivate && <InfoIcon Icon={AiFillEyeInvisible} />}
                        {(meal?.isPrivate && meal?.isToTry) && <div className={"separatorLine"} />}
                        {meal?.isToTry && <InfoIcon Icon={BiSolidHourglassTop} />}
                        {(meal?.isToTry && !!tags?.length) && <div className={"separatorLine"} />}
                        {!!tags?.length && tags.map(tag => (<Tag key={tag.id} name={tag.name} />))}
                    </div>
                    <div>
                        {meal?.freeText}
                    </div>
                    <MealImageGrid>
                        {mealImages?.map((image, index) => (
                            <MealImageGridImage
                                key={image.id}
                                src={image.publicUrl}
                                alt={`Meal Image ${index + 1}`}
                                onClick={() => {
                                    openCarousel(index)
                                }}
                            />
                        ))}
                    </MealImageGrid>
                    {mealImages && (
                        <CarouselModal
                            startIndex={carouselStartIndex}
                            isOpen={isCarouselOpen}
                            onClose={closeCarousel}
                            images={mealImages}
                        />
                    )}
                    <PlanButton meal={meal} />
                </>
            )}
        </>
    );
}
