import {Box, Image} from '@mantine/core';
import {TbSalad} from "react-icons/tb";
import {useMainMealImage} from "../../../utils/data/helpers/useMainMealImage.tsx";

const thumbnailWidth = 80;
const thumbnailHeight = 80;

export function MainMealImage({mealId, mealTitle}: { mealId: string, mealTitle: string }) {
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
                <TbSalad size={thumbnailWidth / 2} />
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
