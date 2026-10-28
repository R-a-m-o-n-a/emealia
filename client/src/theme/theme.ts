import {createTheme} from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {emealiaGreen, tmpRed} from './colors';
import {mdComponentDefaults} from "./mdComponentDefaults.ts";
import {otherComponentDefaults} from "./otherComponentDefaults.ts";

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
        ...mdComponentDefaults,
        ...otherComponentDefaults
    },
});