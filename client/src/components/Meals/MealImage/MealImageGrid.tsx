import type {MealImage as DbMealImage} from "@emealia/shared";
import {MealImage} from "./MealImage";
import "./MealImageGrid.css";

interface MealImageGridProps {
    images: DbMealImage[] | undefined;
}

export function MealImageGrid({images}: MealImageGridProps) {
    if (!images || !images.length) {
        return null;
    }

    return (
        <div className={"MealImageGrid"}>
            {images.map((image, index) => (
                <MealImage key={image.id} publicUrl={image.publicUrl} alt={`meal image ${index}`} />
            ))}
        </div>
    );
}
