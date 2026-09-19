import "./AddMealPage.css";
import {useNavigate, useParams} from "react-router";
import {useMeal} from "../../../utils/data/helpers/useMeal.ts";
import {useTagsByMealId} from "../../../utils/data/helpers/useTagsByMealId.tsx";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {EditMealForm} from "./EditMealForm.tsx";

export function EditMealPage() {
    const navigate = useNavigate();
    const params = useParams();
    const {id: mealId} = params;
    const meal = useMeal(mealId);
    const tags = useTagsByMealId(mealId);
    const navigateBack = () => navigate(-1);

    return (
        <div className={"AddMealPage"}>
            <Navbar>
                <BackButton/>
                Edit Meal
                <DoneButton onClick={navigateBack}/>
            </Navbar>

            <EditMealForm
                key={mealId}
                existingMeal={meal}
                existingTags={tags}
            />
        </div>
    );
}
