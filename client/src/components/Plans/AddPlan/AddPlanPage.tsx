import {useState} from "react";
import {useNavigate} from "react-router";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {EditPlanForm} from "./EditPlanForm.tsx";

export function AddPlanPage() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

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

            <EditPlanForm isSaving={isSaving} setIsSaving={setIsSaving} onSuccess={navigateToPlans} />
        </>
    );
}
