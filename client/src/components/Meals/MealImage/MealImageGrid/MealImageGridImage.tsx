import {Image} from "@mantine/core";
import {gridImageHeight, gridImageWidth} from "./MealImageGrid.tsx";

interface MealImageProps {
    src: string,
    alt: string,
}

export function MealImageGridImage({src, alt}: MealImageProps) {
    return (
        <Image
            src={src}
            h={gridImageHeight}
            w={gridImageWidth}
            radius="md"
            fit="cover"
            alt={alt}
        />
    )
}