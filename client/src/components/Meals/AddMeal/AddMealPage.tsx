import "./AddMealPage.css";
import {useState} from "react";
import {useNavigate} from "react-router";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {EditMealForm} from "./EditMealForm.tsx";

export function AddMealPage() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    function navigateToMeals() {
        navigate("/meals"); // todo scroll to newly added meal
    }

    return (
        <div className={"AddMealPage"}>
            <Navbar>
                <BackButton />
                New Meal
                <DoneButton isLoading={isSaving} />
            </Navbar>

            <EditMealForm isSaving={isSaving} setIsSaving={setIsSaving} onSuccess={navigateToMeals} />
        </div>
    );
}
