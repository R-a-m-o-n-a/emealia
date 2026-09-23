import {Dropzone, type FileWithPath, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import {TbPlus} from 'react-icons/tb';
import {gridImageHeight, gridImageWidth} from "../../MealImageGrid/MealImageGrid.tsx";

import "./ImageDropzone.css"

export function ImageDropzone({onDrop}: { onDrop: (files: FileWithPath[]) => void }) {
    return (
        <Dropzone
            onDrop={onDrop}
            accept={IMAGE_MIME_TYPE}
            h={gridImageHeight}
            w={gridImageWidth}
            radius="md"
            className="ImageDropzone"
        >
            <TbPlus size={36} />
        </Dropzone>
    );
}
