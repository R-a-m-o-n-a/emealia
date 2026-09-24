import type {MealImage} from "@emealia/shared";

export const ImageKind = {
    existing: "existing",
    new: "new",
} as const;

export type ImageKind = typeof ImageKind[keyof typeof ImageKind];

export type ExistingImage = {
    kind: typeof ImageKind.existing;
    id: string;
    url: string;
    isMain: boolean;
    raw: MealImage
};
export type NewImage = {
    kind: typeof ImageKind.new;
    id: string;
    url: string;
    isMain: boolean;
    blob: Blob
};

export type UnifiedImage = ExistingImage | NewImage;

export const isExistingImage = (img: UnifiedImage): img is ExistingImage =>
    img.kind === ImageKind.existing;
export const isNewImage = (img: UnifiedImage): img is NewImage =>
    img.kind === ImageKind.new;