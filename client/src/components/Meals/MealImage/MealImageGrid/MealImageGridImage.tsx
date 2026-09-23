import {Image} from "@mantine/core";

interface MealImageProps {
    src: string,
    alt: string,
}

export function MealImageGridImage({src, alt}: MealImageProps) {
    return (
        <Image
            src={src}
            w="120px"
            h="120px"
            radius="md"
            fit="cover"
            alt={alt}
        />
    )
}