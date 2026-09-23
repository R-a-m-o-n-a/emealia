import {Box} from '@mantine/core';
import {type FileWithPath} from '@mantine/dropzone';
import type {Dispatch, SetStateAction} from "react";
import {compressImage} from '../../../../utils/images/imageCompressor.ts';
import {MealImageGrid} from "../MealImageGrid/MealImageGrid.tsx";
import {MealImageGridImage} from "../MealImageGrid/MealImageGridImage.tsx";
import {ImageKind, type UnifiedImage} from "../UnifiedImage.tsx";
import {DeleteXActionIcon} from "./DeleteXActionIcon.tsx";
import {ImageDropzone} from "./ImageDropzone/ImageDropzone.tsx";

interface ImageDropzoneGridProps {
    images: UnifiedImage[];
    setImages: Dispatch<SetStateAction<UnifiedImage[]>>;
}

export function ImageDropzoneGrid({images, setImages}: ImageDropzoneGridProps) {
    const handleDrop = async (files: FileWithPath[]) => {
        const processedImages: UnifiedImage[] = await Promise.all(
            files.map(async (file) => {
                let compressedResult: Blob = file;
                try {
                    compressedResult = await compressImage(file);
                } catch (error) {
                    console.error('Image compression failed:', error);
                }
                return {
                    kind: ImageKind.new,
                    id: crypto.randomUUID(),
                    url: URL.createObjectURL(compressedResult),
                    blob: compressedResult,
                };
            })
        );

        setImages((prev) => [...prev, ...processedImages]);
    };

    const handleRemove = (id: string) => {
        setImages((prev) => {
            const removed = prev.find((item) => item.id === id);
            if (removed && removed.kind === "new") {
                URL.revokeObjectURL(removed.url);
            }
            return prev.filter((item) => item.id !== id);
        });
    };

    return (
        <MealImageGrid>
            <ImageDropzone onDrop={handleDrop} />

            {images.map((image, index) => (
                <Box key={image.id} pos="relative">
                    <MealImageGridImage
                        key={image.id}
                        src={image.url}
                        alt={`Meal image ${index + 1}`}
                    />
                    <DeleteXActionIcon onClick={() => {
                        handleRemove(image.id)
                    }}
                    />
                </Box>
            ))}
        </MealImageGrid>
    );
}