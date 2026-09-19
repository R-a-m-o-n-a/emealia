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
    const meal = useMeal(mealId);
    const tags = useTagsByMealId(mealId);
    console.log(location)

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
                onSuccess={navigateToDetails}
            />
        </div>
    );
}
