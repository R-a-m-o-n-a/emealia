import { ActionIcon } from "@mantine/core";
import {DateInput, DatePickerInput, DateTimePicker} from '@mantine/dates';

export const otherComponentDefaults = {
    ActionIcon: ActionIcon.extend({
        defaultProps: {
            variant: 'light',
            radius: 'xl',
            size: 'input-md',
        },
    }),

    DatePickerInput: DatePickerInput.extend({
        defaultProps: {
            size: 'md',
            valueFormat: 'L',
        },
    }),
    DateInput: DateInput.extend({
        defaultProps: {
            size: 'md',
            valueFormat: 'L',
        },
    }),
    DateTimePicker: DateTimePicker.extend({
        defaultProps: {
            size: 'md',
            valueFormat: 'L LT',
        },
    }),
};