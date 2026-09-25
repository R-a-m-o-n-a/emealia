import type {MealImage} from "@emealia/shared";
import {addMealImages} from "../../../utils/data/helpers/addMealImages.ts";
import {removeMealImages} from "../../../utils/data/helpers/removeMealImages.ts";
import {updateMealImageOrder} from "../../../utils/data/helpers/updateMealImageOrder.ts";
import {isExistingImage, isNewImage, type UnifiedImage} from "../MealImage/UnifiedImage.tsx";

export async function handlePersistImageChanges(
    dbImages: MealImage[] | undefined,
    images: UnifiedImage[],
    mealId: string,
    userId: string
) {
    if (!mealId) {
        return;
    }

    const imagesWithPositions = images.map((image, index) => ({
        image,
        position: index,
    }));

    const newUploads = imagesWithPositions
        .filter(({image}) => isNewImage(image))
        .map(({image, position}) => ({
            id: image.id,
            url: image.url,
            blob: (image as Extract<UnifiedImage, { kind: "new" }>).blob,
            isMain: image.isMain,
            position,
        }));

    if (newUploads.length > 0) {
        await addMealImages(userId, mealId, newUploads);
    }

    if (dbImages) {
        const keptExistingImageIds = new Set(images.filter(isExistingImage).map((img) => img.id));

        const removedImageIds = dbImages
            .filter((img) => !keptExistingImageIds.has(img.id))
            .map((img) => img.id);

        if (removedImageIds.length > 0) {
            await removeMealImages(userId, mealId, removedImageIds);
        }

        const dbImageMap = new Map(
            dbImages.map((img) => [img.id, img],)
        );

        const updatesToPositionAndIsMain = imagesWithPositions
            .filter(({image}) => isExistingImage(image))
            .filter(({image, position}) => {
                const dbImage = dbImageMap.get(image.id);
                return dbImage?.position !== position || image.isMain !== dbImage.isMain;
            })
            .map(({image, position}) => ({
                id: image.id,
                position,
                isMain: image.isMain,
            }));

        if (updatesToPositionAndIsMain.length > 0) {
            await updateMealImageOrder(userId, mealId, updatesToPositionAndIsMain);
        }
    }
}