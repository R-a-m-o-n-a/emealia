import {ActionIcon, createTheme} from '@mantine/core';
import {DateInput, DatePickerInput, DateTimePicker} from "@mantine/dates";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {emealiaGreen, tmpRed} from './colors';

// Register the localized date format plugin with dayjs
dayjs.extend(localizedFormat);

export const theme = createTheme({
    colors: {
        'red': tmpRed,
        'emealia-green': emealiaGreen,
    },
    primaryColor: 'emealia-green',
    primaryShade: {light: 9, dark: 9},
    components: {
        ActionIcon: ActionIcon.extend({
            defaultProps: {
                variant: 'light',
                radius: 'xl',
                size: 'input-md',
            },
        }),

        /*
        Button: Button.extend({
            defaultProps: {
                variant: 'outline',
                radius: 'md',
            },
        }),*/

        DatePickerInput: DatePickerInput.extend({
            defaultProps: {
                valueFormat: 'L', // Adapts automatically to active locale!
            },
        }),
        DateInput: DateInput.extend({
            defaultProps: {
                valueFormat: 'L',
            },
        }),
        DateTimePicker: DateTimePicker.extend({
            defaultProps: {
                valueFormat: 'L LT', // formats under https://day.js.org/docs/en/display/format#list-of-localized-formats
            },
        }),
    },
});