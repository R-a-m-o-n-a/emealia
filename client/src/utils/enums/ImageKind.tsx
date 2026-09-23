export const ImageKind = {
    existing: "existing",
    new: "new",
} as const;

export type ImageKind = typeof ImageKind[keyof typeof ImageKind];