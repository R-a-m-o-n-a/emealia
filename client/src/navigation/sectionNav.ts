import type {IconType} from 'react-icons';
import {TbClipboardListFilled, TbSalad} from 'react-icons/tb';

export type SectionNavItem = {
    path: string;
    label: string;
    Icon: IconType;
};

export const sectionNavItems: SectionNavItem[] = [
    {path: 'meals', label: 'Meals', Icon: TbSalad},
    {path: 'plans', label: 'Plans', Icon: TbClipboardListFilled},
];
