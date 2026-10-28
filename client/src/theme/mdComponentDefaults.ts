import {
    Autocomplete,
    Button,
    Checkbox,
    Chip,
    ColorInput,
    FileInput,
    MultiSelect,
    Radio,
    SegmentedControl,
    Select,
    Switch,
    TagsInput,
    Textarea,
    TextInput,
} from '@mantine/core';

export const mdComponentDefaults = {
    Autocomplete: Autocomplete.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    Button: Button.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    TagsInput: TagsInput.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    TextInput: TextInput.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    Textarea: Textarea.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    Select: Select.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    MultiSelect: MultiSelect.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    FileInput: FileInput.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    ColorInput: ColorInput.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    Checkbox: Checkbox.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    Radio: Radio.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    Switch: Switch.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    Chip: Chip.extend({
        defaultProps: {
            size: 'md',
        },
    }),
    SegmentedControl: SegmentedControl.extend({
        defaultProps: {
            size: 'md',
        },
    }),
};