'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'cyan',
    colors: {
        // Custom color palette can be defined here if needed
        // Using built-in cyan for a fresh, trustworthy look suitable for church
    },
    fontFamily: 'var(--font-geist-sans), sans-serif',
    headings: {
        fontFamily: 'var(--font-geist-sans), sans-serif',
    },
    components: {
        Container: {
            defaultProps: {
                size: 'lg',
            },
        },
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        Card: {
            defaultProps: {
                radius: 'lg',
                shadow: 'sm',
            },
        },
    },
});
