import {ActionIcon, Box, Group, Image, useMantineTheme} from '@mantine/core';
import {Dropzone, type FileWithPath, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import type {Dispatch, SetStateAction} from "react";
import {TbPlus, TbX} from 'react-icons/tb';
import {compressImage} from '../../../../utils/images/imageCompressor.ts';
import './ImageDropzoneGrid.css';

export interface UploadedImage {
    id: string;
    url: string;
    blob: Blob;
}

interface ImageDropzoneGridProps {
    images: UploadedImage[];
    setImages: Dispatch<SetStateAction<UploadedImage[]>>;
}

export function ImageDropzoneGrid({images, setImages}: ImageDropzoneGridProps) {
    const theme = useMantineTheme();

    const handleDrop = async (files: FileWithPath[]) => {
        const processedImages = await Promise.all(
            files.map(async (file) => {
                let compressedResult: Blob = file;
                try {
                    compressedResult = await compressImage(file);
                } catch (error) {
                    console.error('Image compression failed:', error);
                }
                return {
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
            const filtered = prev.filter((item) => item.id !== id);
            const removed = prev.find((item) => item.id === id);
            if (removed) {
                URL.revokeObjectURL(removed.url);
            }
            return filtered;
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
                <TbPlus size={36} color={theme.colors.lime[6]} /> {/*todo color*/}
            </Dropzone>

            {images.map((img) => (
                <Box key={img.id} className="ImageDropzoneGrid-previewBox">
                    <Image
                        src={img.url}
                        w={120}
                        h={120}
                        fit="cover"
                        radius="md"
                        alt="Uploaded preview"
                    />
                    <ActionIcon
                        variant="filled"
                        color="red"
                        size="xs"
                        radius="xl"
                        className="ImageDropzoneGrid-removeButton"
                        onClick={() => handleRemove(img.id)}
                    >
                        <TbX size={12} />
                    </ActionIcon>
                </Box>
            ))}
        </Group>
    );
}