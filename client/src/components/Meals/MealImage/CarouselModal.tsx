import {Modal} from '@mantine/core';
import classes from './CarouselModal.module.css';
import {ImageCarousel, type ImageCarouselProps} from './ImageCarousel';

export interface CarouselModalProps extends Omit<ImageCarouselProps, 'onClose'> {
    isOpen: boolean;
    onClose: () => void;
}

export function CarouselModal({
                                  isOpen,
                                  onClose,
                                  images,
                                  startIndex,
                              }: CarouselModalProps) {
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
            <ImageCarousel
                images={images}
                startIndex={startIndex}
                onClose={onClose}
            />
        </Modal>
    );
}