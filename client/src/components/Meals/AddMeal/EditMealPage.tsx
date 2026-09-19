import "./AddMealPage.css";
import {useLocation, useNavigate, useParams} from "react-router";
import {useMeal} from "../../../utils/data/helpers/useMeal.ts";
import {useTagsByMealId} from "../../../utils/data/helpers/useTagsByMealId.tsx";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {EditMealForm} from "./EditMealForm.tsx";

export function EditMealPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const {id: mealId} = params;
    const mealFromDb = useMeal(mealId);
    const tagsFromDb = useTagsByMealId(mealId);

    const meal = mealFromDb ?? location.state?.meal;
    const tags = tagsFromDb ?? location.state?.tags;

    function navigateToDetails() {
        const cameFromDetails = location.state?.fromDetails;

        if (!cameFromDetails) {
            navigate(`/meals/${mealId}`, {replace: true});
        } else {
            navigate(-1);
        }
    }

    return (
        <div className={"AddMealPage"}>
            <Navbar>
                <BackButton onClickOverwrite={navigateToDetails} /> todo check if you want to discard or save
                                                                    Edit Meal
                <DoneButton form="edit-meal-form" type="submit" />
            </Navbar>

            <EditMealForm
                key={mealId}
                existingMeal={meal}
                existingTags={tags}
                existingCategoryName={location.state?.category?.name}
                onSuccess={navigateToDetails}
            />
        </div>
    );
}
