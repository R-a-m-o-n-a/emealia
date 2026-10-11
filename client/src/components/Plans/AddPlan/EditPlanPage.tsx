import {Button, Group, Modal} from "@mantine/core";
import {useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {usePlan} from "../../../utils/data/helpers/usePlan.ts";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {EditPlanForm, type EditPlanFormHandle} from "./EditPlanForm.tsx";

export function EditPlanPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const {id: planId} = params;
    const planFromDb = usePlan(planId);

    const plan = planFromDb ?? location.state?.plan;

    const formRef = useRef<EditPlanFormHandle>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    function navigateBack() {
        navigate(-1);
    }

    function handleBackClick() {
        if (formRef.current?.hasChanges()) {
            setIsConfirmModalOpen(true);
        } else {
            navigateBack();
        }
    }

    return (
        <div className={"AddPlanPage"}>
            <Navbar>
                <BackButton onClickOverwrite={handleBackClick} />
                Edit Plan
                <DoneButton isLoading={isSaving} form="edit-plan-form" type="submit" />
            </Navbar>

            <EditPlanForm
                key={planId}
                existingPlan={plan}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
                onSuccess={navigateBack}
                formRef={formRef}
            />

            <Modal
                opened={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Unsaved Changes"
            >
                <p>You have made changes. Do you want to save or discard them?</p>
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => {
                        setIsConfirmModalOpen(false);
                        navigateBack();
                    }}
                    >
                        Discard
                    </Button>
                    <Button
                        form="edit-plan-form"
                        type="submit"
                        onClick={() => setIsConfirmModalOpen(false)}
                    >
                        Save
                    </Button>
                </Group>
            </Modal>
        </div>
    );
}
