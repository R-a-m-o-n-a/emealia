import {useMemo} from 'react'
import {SegmentedControl} from '@mantine/core';
import {useLocation, useNavigate} from 'react-router';
import {TbBurger, TbCarrot, TbClipboardListFilled, TbPizza, TbSalad, TbSoup} from "react-icons/tb";
import {LabelWithIcon} from "./LabelWithIcon.tsx";

// 1. Food icons pool
const MEAL_ICONS = [TbSalad, TbPizza, TbBurger, TbSoup, TbCarrot];

// 2. Evaluates ONCE per page load
const RandomMealIcon = MEAL_ICONS[Math.floor(Math.random() * MEAL_ICONS.length)];

// 3. Static configuration lives outside the component
const NAV_ITEMS = [
    {value: 'meals', labelText: 'Meals', Icon: RandomMealIcon},
    {value: 'plans', labelText: 'Plans', Icon: TbClipboardListFilled},
] as const;

export function FloatingTabs() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPathname = location.pathname.split('/')[1];

    const activeValue = NAV_ITEMS.find((item) => item.value === currentPathname)?.value;

    const options = useMemo(() => {
        return NAV_ITEMS.map((item) => ({
            value: item.value,
            label: <LabelWithIcon label={item.labelText} Icon={item.Icon} value={item.value}/>,
        }));
    }, []);

    return (
        <SegmentedControl
            value={activeValue}
            transitionDuration={250}
            onChange={(value) => navigate(`/${value}`)}
            withItemsBorders={false}
            size="md"
            radius="xl"
            data={options}
        />
    );
}