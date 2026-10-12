import type {Meal} from "@emealia/shared";
import {Button} from '@mantine/core';
import {TbClipboardListFilled} from 'react-icons/tb';
import {useNavigate} from 'react-router';

export function PlanButton({meal}: { meal: Meal }) {
    const navigate = useNavigate();

    function navigateToAddPlan() {
        navigate(`/plans/add`, {state: {mealToConnect: meal}});
    }

    // todo make floating at bottom right
    return (
        <Button
            onClick={navigateToAddPlan}
            leftSection={<TbClipboardListFilled size={18} />}
            radius="xl"
            variant="light"
        >
            Plan
        </Button>
    );
}