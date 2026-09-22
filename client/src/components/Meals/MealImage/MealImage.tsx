interface MealImageProps {
    publicUrl: string | undefined,
    alt: string,
}

export function MealImage({publicUrl, alt}: MealImageProps) {
    return (
        <img
            src={publicUrl}
            alt={alt}
            loading="lazy"
            style={{width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover'}}
        />
    )
}