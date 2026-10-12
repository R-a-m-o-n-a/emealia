import type {Meal, Plan} from "@emealia/shared";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {EditPlanForm} from "./EditPlanForm.tsx";

export function AddPlanPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isSaving, setIsSaving] = useState(false);

    let planPreset: Partial<Plan> | undefined;

    if (location.state?.mealToConnect) {
        const meal: Meal = location.state.mealToConnect;

        planPreset = {
            connectedMealId: meal.id,
            title: meal.title,
        };
    }

    function navigateToPlans() {
        navigate("/plans");
    }

    return (
        <>
            <Navbar>
                <BackButton />
                New Plan
                <DoneButton isLoading={isSaving} />
            </Navbar>

            <EditPlanForm
                isSaving={isSaving}
                existingPlan={planPreset}
                setIsSaving={setIsSaving}
                onSuccess={navigateToPlans}
            />
        </>
    );
}
