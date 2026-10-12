import {useAuth} from "../../contexts/AuthContext.tsx";
import {usePlans} from "../../utils/data/helpers/usePlans.ts";
import {PlanItem} from "./PlanItem.tsx";

export function PlansList() {
    const {userId} = useAuth();
    const plans = usePlans(userId);

    return (
        <>
            {plans?.map((plan) => (
                <PlanItem plan={plan} key={plan.id} />
            ))}
        </>
    );
}