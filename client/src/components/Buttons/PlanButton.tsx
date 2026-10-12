import type {Meal} from "@emealia/shared";
import {Button} from '@mantine/core';
import {TbClipboardListFilled} from 'react-icons/tb';
import {useNavigate} from 'react-router';

import classes from './PlanButton.module.css';

export function PlanButton({meal}: { meal: Meal }) {
    const navigate = useNavigate();

    function navigateToAddPlan() {
        navigate(`/plans/add`, {state: {mealToConnect: meal}});
    }

    // todo make floating at bottom right
    return (
        <Button
            className={classes.PlanButton}
            onClick={navigateToAddPlan}
            leftSection={<TbClipboardListFilled size={18} />}
            radius="xl"
            variant="default"
        >
            Plan
        </Button>
    );
}