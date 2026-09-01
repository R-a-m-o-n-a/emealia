import {ActionIcon, createTheme} from '@mantine/core';

export const theme = createTheme({
    colors: {
        'random-green': ['#edfbeb', '#def1db', '#bee1b9', '#9cd094', '#7fc174', '#6cb85f', '#61b454', '#509e44', '#458d3a', '#377a2e'],
        'emealia-green': ['#f0faf2', '#e0f2e4', '#bbe4c5', '#93d7a3', '#73cb87', '#5ec474', '#53c16b', '#43a95a', '#39974e', '#28793c'],
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