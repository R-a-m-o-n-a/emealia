import type {LocalMealImage} from '@emealia/shared';
import {Carousel} from '@mantine/carousel';
import {Box, Image, Modal} from '@mantine/core';
import {useEffect, useState} from 'react';
import classes from './ImageCarousel.module.css';

const EDGE_GUTTER = 20;

function getDisplaySize(image: LocalMealImage) {
    const safeLeft = Number.parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--safe-area-left'),
    ) || 0;
    const safeRight = Number.parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--safe-area-right'),
    ) || 0;
    const safeTop = Number.parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--safe-area-top'),
    ) || 0;
    const safeBottom = Number.parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--safe-area-bottom'),
    ) || 0;

    const maxWidth = window.innerWidth - safeLeft - safeRight - EDGE_GUTTER * 2;
    const maxHeight = window.innerHeight - safeTop - safeBottom - EDGE_GUTTER * 2;

    // Never enlarge an image beyond its own dimensions.
    const scale = Math.min(
        1,
        maxWidth / image.width,
        maxHeight / image.height,
    );

    return {
        width: Math.floor(image.width * scale),
        height: Math.floor(image.height * scale),
    };
}

export interface ImageCarouselProps {
    images: LocalMealImage[];
    startIndex: number;
    onClose?: () => void;
}

export function ImageCarousel({images, startIndex, onClose,}: ImageCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(startIndex);
    const [viewportSize, setViewportSize] = useState(() =>
        getDisplaySize(images[startIndex]),
    );

    useEffect(() => {
        const updateSize = () => setViewportSize(getDisplaySize(images[activeIndex]));

        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [activeIndex, images]);

    const activeImage = images[activeIndex];

    useEffect(() => {
        setViewportSize(getDisplaySize(activeImage));
    }, [activeImage]);

    return (
        <Box
            className={classes.carouselWrapper}
            style={{
                width: viewportSize.width,
                height: viewportSize.height,
            }}
        >
            {onClose && (
                <Modal.CloseButton
                    onClick={onClose}
                    className={classes.closeButton}
                    variant={"light"}
                />
            )}

            <Carousel
                withControls
                withIndicators
                controlSize={32}
                initialSlide={startIndex}
                onSlideChange={setActiveIndex}
                emblaOptions={{loop: true, align: 'center'}}
                classNames={{
                    root: classes.carouselRoot,
                    controls: classes.carouselControls,
                    control: classes.carouselControl,
                    indicators: classes.carouselIndicators,
                    indicator: classes.carouselIndicator,
                }}
            >
                {images.map((image) => (
                    <Carousel.Slide key={image.id}>
                        <Image
                            src={image.publicUrl}
                            fit="contain"
                            className={classes.carouselImage}
                        />
                    </Carousel.Slide>
                ))}
            </Carousel>
        </Box>
    );
}