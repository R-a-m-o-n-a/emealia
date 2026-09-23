import type {MealImage} from '@emealia/shared';
import {Box, Group, Image, useMantineTheme} from '@mantine/core';
import {Dropzone, type FileWithPath, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import type {Dispatch, SetStateAction} from "react";
import {TbPlus} from 'react-icons/tb';
import {ImageKind} from "../../../../utils/enums/ImageKind.tsx";
import {compressImage} from '../../../../utils/images/imageCompressor.ts';
import './ImageDropzoneGrid.css';
import {DeleteXActionIcon} from "./DeleteXActionIcon.tsx";

export type UnifiedImage =
    | { kind: ImageKind.existing; id: string; url: string; raw: MealImage }
    | { kind: ImageKind.new; id: string; url: string; blob: Blob };

interface ImageDropzoneGridProps {
    images: UnifiedImage[];
    setImages: Dispatch<SetStateAction<UnifiedImage[]>>;
}

export function ImageDropzoneGrid({images, setImages}: ImageDropzoneGridProps) {
    const theme = useMantineTheme();

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
        <Group align="flex-start" gap="md">
            <Dropzone
                onDrop={handleDrop}
                accept={IMAGE_MIME_TYPE}
                classNames={{
                    root: "ImageDropzoneGrid-dropzoneRoot",
                    inner: "ImageDropzoneGrid-dropzoneInner",
                }}
            >
                <TbPlus size={36} color={theme.colors.lime[6]} />
            </Dropzone>

            {images.map((img) => (
                <Box key={img.id} className="ImageDropzoneGrid-previewBox">
                    <Image
                        src={img.url}
                        w={120}
                        h={120}
                        fit="cover"
                        alt="Meal preview"
                    />
                    <DeleteXActionIcon onClick={() => {
                        handleRemove(img.id)
                    }}
                    />
                </Box>
            ))}
        </Group>
    );
}