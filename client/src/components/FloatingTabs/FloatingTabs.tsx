import {useMemo, useState} from 'react';
import type {IconType} from "react-icons";

import {SegmentedControl} from '@mantine/core';
import {useLocation, useNavigate} from 'react-router';
import {
    TbBurger,
    TbCarrot,
    TbClipboardListFilled,
    TbCookie,
    TbGlassFull,
    TbPizza,
    TbSalad,
    TbSoup
} from "react-icons/tb";
import {LabelWithIcon} from "./LabelWithIcon";

const MEAL_ICONS = [
    TbSalad,
    TbPizza,
    TbBurger,
    TbSoup,
    TbCarrot,
    TbCookie,
    TbGlassFull
];

const getRandomMealIcon = (previousIcon?: unknown) => {
    const availableIcons = MEAL_ICONS.filter((icon) => icon !== previousIcon);
    return availableIcons[Math.floor(Math.random() * availableIcons.length)];
};

export function FloatingTabs() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPathname = location.pathname.split('/')[1];
    const activeValue = currentPathname === 'plans' ? 'plans' : 'meals';

    const [currentMealIcon, setCurrentMealIcon] = useState(() => getRandomMealIcon());

    const handleTabChange = (pathToOpen: string) => {
        if (pathToOpen === 'meals') {
            setCurrentMealIcon((prev: IconType) => getRandomMealIcon(prev));
        }

        navigate(`/${pathToOpen}`);
    };

    const options = useMemo(() => {
        const navItems = [
            {value: 'meals', labelText: 'Meals', Icon: currentMealIcon},
            {value: 'plans', labelText: 'Plans', Icon: TbClipboardListFilled},
        ];

        return navItems.map((item) => ({
            value: item.value,
            label: (
                <LabelWithIcon
                    label={item.labelText}
                    Icon={item.Icon}
                    value={item.value}
                />
            ),
        }));
    }, [currentMealIcon]);

    return (
        <SegmentedControl
            value={activeValue}
            onChange={handleTabChange}
            transitionDuration={450}
            withItemsBorders={false}
            size="md"
            radius="xl"
            data={options}
        />
    );
}