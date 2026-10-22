import {Box, Image} from '@mantine/core';
import {TbSalad} from "react-icons/tb";
import {useMainMealImage} from "../../../utils/data/helpers/useMainMealImage.tsx";

const defaultWidth = 80;
const defaultHeight = 80;

interface MealThumbnailProps {
    mealId: string,
    mealTitle: string,
    thumbnailWidth?: number | string,
    thumbnailHeight?: number | string,
}

export function MealThumbnail({
                                  mealId,
                                  mealTitle,
                                  thumbnailWidth = defaultWidth,
                                  thumbnailHeight = defaultHeight
                              }: MealThumbnailProps) {
    const image = useMainMealImage(mealId);

    if (!image) {
        return (
            <Box
                w={thumbnailWidth}
                h={thumbnailHeight}
                bg="primary.0"
                c="primary.6"
                bdrs={"md"}
                display="flex"
                style={{alignItems: 'center', justifyContent: 'center'}}
            >
                <TbSalad size={"50%"} />
            </Box>
        );
    }

    return (
        <Image
            src={image.publicUrl}
            h={thumbnailHeight}
            w={thumbnailWidth}
            radius="md"
            fit="cover"
            alt={"Main image for meal " + mealTitle}
        />
    );
}
