import {Image} from "@mantine/core";
import {gridImageHeight, gridImageWidth} from "./MealImageGrid.tsx";

interface MealImageProps {
    src: string;
    alt: string;
    isMain: boolean;
}

export function MealImageGridImage({src, alt, isMain}: MealImageProps) {
    const maskStyle = isMain
        ? {
            WebkitMask: "radial-gradient(circle, black 66%, rgba(0, 0, 0, 0.3) 0)",
            mask: "radial-gradient(circle, black 66%, rgba(0, 0, 0, 0.3) 0)",
        }
        : undefined;

    return (
        <Image
            src={src}
            h={gridImageHeight}
            w={gridImageWidth}
            radius="md"
            fit="cover"
            alt={alt}
            style={maskStyle}
        />
    );
}