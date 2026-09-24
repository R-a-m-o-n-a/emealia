import {useSortable} from '@dnd-kit/react/sortable';
import {Box, Button, Group, Popover, Text} from '@mantine/core';
import {MealImageGridImage} from '../MealImageGrid/MealImageGridImage.tsx';
import type {UnifiedImage} from '../UnifiedImage.tsx';
import {DeleteXActionIcon} from './DeleteXActionIcon.tsx';

interface SortableMealImageProps {
    image: UnifiedImage;
    index: number;
    confirmationOpen: boolean;
    onCloseConfirmation: () => void;
    onConfirmMakeMain: (id: string) => void;
    onRemove: (id: string) => void;
}

export function SortableMealImage({
                                      image,
                                      index,
                                      confirmationOpen,
                                      onCloseConfirmation,
                                      onConfirmMakeMain,
                                      onRemove,
                                  }: SortableMealImageProps) {
    const {
        ref: sortableRef,
        isDragging,
    } = useSortable({
        id: image.id,
        index,
        type: 'meal-image',
        accept: 'meal-image',
    });

    return (
        <Popover
            opened={confirmationOpen}
            onClose={onCloseConfirmation}
            position="bottom"
            withArrow
            shadow="md"
        >
            <Popover.Target>
                <Box
                    ref={sortableRef}
                    pos="relative"
                    style={{
                        scale: isDragging ? '1.05' : '1',
                        boxShadow: isDragging
                            ? '0 14px 30px rgb(0 0 0 / 28%)'
                            : undefined,
                        transition: 'scale 120ms ease, box-shadow 120ms ease',
                        touchAction: 'none',
                        zIndex: isDragging ? 1 : undefined,
                    }}
                >
                    <MealImageGridImage
                        src={image.url}
                        alt={`Meal image ${index + 1}`}
                        isMain={image.isMain}
                    />

                    <Box onPointerDown={(event) => event.stopPropagation()}>
                        <DeleteXActionIcon onClick={() => onRemove(image.id)} />
                    </Box>
                </Box>
            </Popover.Target>

            <Popover.Dropdown>
                <Text size="sm" mb="sm">
                    Make this the main image?
                </Text>

                <Group justify="flex-end" gap="xs">
                    <Button size="xs" variant="default" onClick={onCloseConfirmation}>
                        Cancel
                    </Button>
                    <Button
                        size="xs"
                        onClick={() => {
                            onConfirmMakeMain(image.id);
                            onCloseConfirmation();
                        }}
                    >
                        Make main
                    </Button>
                </Group>
            </Popover.Dropdown>
        </Popover>
    );
}