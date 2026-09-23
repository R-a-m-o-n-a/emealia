import {ActionIcon, createTheme} from '@mantine/core';
import {emealiaGreen, tmpRed} from './colors';

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
    },
});