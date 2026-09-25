import {PointerActivationConstraints, PointerSensor} from '@dnd-kit/dom';
import {DragDropProvider} from '@dnd-kit/react';
import {isSortable} from '@dnd-kit/react/sortable';
import type {FileWithPath} from "@mantine/dropzone";
import {type Dispatch, type SetStateAction, useState} from 'react';
import {compressImage} from "../../../../utils/images/imageCompressor.ts";

import {MealImageGrid} from '../MealImageGrid/MealImageGrid.tsx';
import {ImageKind, type UnifiedImage} from "../UnifiedImage.tsx";
import {ImageDragDropProvider} from "./ImageDragDropProvider.tsx";
import {ImageDropzone} from './ImageDropzone/ImageDropzone.tsx';
import {SortableMealImage} from './SortableMealImage.tsx';

function vibrate(milliseconds: number) {
    navigator.vibrate?.(milliseconds);
}

interface ImageDropzoneGridProps {
    images: UnifiedImage[];
    setImages: Dispatch<SetStateAction<UnifiedImage[]>>;
}

export function ImageDropzoneGrid({images, setImages}: ImageDropzoneGridProps) {
    const [confirmationImageId, setConfirmationImageId] = useState<string | null>(
        null,
    );

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
                    isMain: false,
                    blob: compressedResult,
                };
            })
        );

        setImages((prev) => {
            if (!prev.some(img => img.isMain) && processedImages.length > 0) {
                processedImages[0].isMain = true;
            }
            return [...prev, ...processedImages];
        });
    };

    const handleRemove = (id: string) => {
        setImages((prev) => {
            const removed = prev.find((item) => item.id === id);
            if (removed && removed.kind === "new") {
                URL.revokeObjectURL(removed.url);
            }
            const newImages = prev.filter((item) => item.id !== id);
            if (removed?.isMain && newImages.length > 0) {
                newImages[0].isMain = true;
            }
            return newImages;
        });
    };

    const handleDragEnd = (event: Parameters<
        NonNullable<React.ComponentProps<typeof DragDropProvider>['onDragEnd']>
    >[0]) => {
        if (event.canceled) return;

        const {source} = event.operation;

        if (!isSortable(source)) return;

        // Long press + release without moving: open confirmation.
        if (source.initialIndex === source.index) {
            setConfirmationImageId(String(source.id));
            return;
        }

        // Long press + drag + release: persist the reordered grid.
        setImages((currentImages) => {
            const reorderedImages = [...currentImages];
            const [movedImage] = reorderedImages.splice(source.initialIndex, 1);

            if (!movedImage) return currentImages;

            reorderedImages.splice(source.index, 0, movedImage);
            return reorderedImages;
        });

        vibrate(15);
    };

    const handleMakeMain = (id: string) => {
        setImages(prevImages => {
            const newImages = prevImages.map((item) => ({
                ...item,
                isMain: false,
            }));
            const newMainImage = newImages.find(img => img.id === id);
            if (newMainImage) {
                newMainImage.isMain = true;
            }
            return newImages;
        })
    };

    return (
        <ImageDragDropProvider
            sensors={(defaultSensors) => [
                ...defaultSensors.filter((sensor) => sensor !== PointerSensor),
                PointerSensor.configure({
                    activationConstraints(event) {
                        if (event.pointerType === 'touch') {
                            return [
                                new PointerActivationConstraints.Delay({
                                    value: 350,
                                    tolerance: 8,
                                }),
                            ];
                        }

                        return [
                            new PointerActivationConstraints.Distance({value: 4}),
                        ];
                    },
                }),
            ]}
            onDragStart={() => vibrate(10)}
            onDragEnd={handleDragEnd}
        >
            <MealImageGrid>
                <ImageDropzone onDrop={handleDrop} />

                {images.map((image, index) => (
                    <SortableMealImage
                        key={image.id}
                        image={image}
                        index={index}
                        confirmationOpen={confirmationImageId === image.id}
                        onCloseConfirmation={() => setConfirmationImageId(null)}
                        onConfirmMakeMain={handleMakeMain}
                        onRemove={handleRemove}
                    />
                ))}
            </MealImageGrid>
        </ImageDragDropProvider>
    );
}