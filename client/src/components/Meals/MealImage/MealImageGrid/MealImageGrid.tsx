import {Group} from "@mantine/core";
import type {ReactNode} from "react";
import "./MealImageGrid.css";

interface MealImageGridProps {
    children: ReactNode
}

export function MealImageGrid({children}: MealImageGridProps) {

    return (
        <Group align="flex-start" gap="md" className={"MealImageGrid"}>
            {children}
        </Group>
    );
}
