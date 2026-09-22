import "./AddMealPage.css";
import {Button, Group, Modal} from "@mantine/core";
import {useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {useMeal} from "../../../utils/data/helpers/useMeal.ts";
import {useMealImagesByMealId} from "../../../utils/data/helpers/useMealImagesByMealId.tsx";
import {useTagsByMealId} from "../../../utils/data/helpers/useTagsByMealId.tsx";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {EditMealForm, type EditMealFormHandle} from "./EditMealForm.tsx";

export function EditMealPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const {id: mealId} = params;
    const mealFromDb = useMeal(mealId);
    const tagsFromDb = useTagsByMealId(mealId);
    const mealImagesFromDb = useMealImagesByMealId(mealId);

    const meal = mealFromDb ?? location.state?.meal;
    const tags = tagsFromDb ?? location.state?.tags;
    const mealImages = mealImagesFromDb ?? location.state?.mealImages;

    const formRef = useRef<EditMealFormHandle>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    function navigateToDetails() {
        const cameFromDetails = location.state?.fromDetails;

        if (!cameFromDetails) {
            navigate(`/meals/${mealId}`, {replace: true});
        } else {
            navigate(-1);
        }
    }

    function handleBackClick() {
        if (formRef.current?.hasChanges()) {
            setIsConfirmModalOpen(true);
        } else {
            navigateToDetails();
        }
    }

    return (
        <div className={"AddMealPage"}>
            <Navbar>
                <BackButton onClickOverwrite={handleBackClick} />
                Edit Meal
                <DoneButton isLoading={isSaving} form="edit-meal-form" type="submit" />
            </Navbar>

            <EditMealForm
                key={mealId}
                existingMeal={meal}
                existingTags={tags}
                existingCategoryName={location.state?.category?.name}
                existingImages={mealImages}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
                onSuccess={navigateToDetails}
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
                        navigateToDetails();
                    }}
                    >
                        Discard
                    </Button>
                    <Button
                        form="edit-meal-form"
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
