import {FocusTrap, Modal} from '@mantine/core';
import {useEffect} from "react";
import classes from './CarouselModal.module.css';
import {ImageCarousel, type ImageCarouselProps} from './ImageCarousel';

export interface CarouselModalProps extends Omit<ImageCarouselProps, 'onClose'> {
    isOpen: boolean;
    onClose: () => void;
}

// todo very wide images on bigger screens don't get shown in full. fix it. http://localhost:5173/meals/25741e39-91fa-4890-9ee7-eb526d361a14
export function CarouselModal({
                                  isOpen,
                                  onClose,
                                  images,
                                  startIndex,
                              }: CarouselModalProps) {
    useEffect(function enableUserScalableWhileModalIsOpen() {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) return;

        if (isOpen) {
            viewportMeta.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes'
            );
        } else {
            viewportMeta.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no'
            );
        }

        return () => {
            viewportMeta.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no'
            );
        };
    }, [isOpen]);

    return (
        <Modal
            centered
            keepMounted={true}
            onClose={onClose}
            opened={isOpen}
            padding={0}
            removeScrollProps={{allowPinchZoom: true}}
            size="auto"
            withCloseButton={false}
            classNames={{
                content: classes.modalContent,
                body: classes.modalBody,
            }}
        >
            <FocusTrap.InitialFocus />
            <ImageCarousel
                images={images}
                startIndex={startIndex}
                onClose={onClose}
            />
        </Modal>
    );
}