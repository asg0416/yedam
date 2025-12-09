'use client';

import { createTheme, Button } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'dark', // Switching to dark/monochrome as primary
    fontFamily: 'var(--font-geist-sans), sans-serif',
    headings: {
        fontFamily: 'var(--font-geist-sans), sans-serif',
        fontWeight: '700',
        sizes: {
            h1: { fontSize: '3rem' },
            h2: { fontSize: '2.25rem' },
            h3: { fontSize: '1.5rem' },
        }
    },
    components: {
        Container: {
            defaultProps: {
                size: 'lg',
            },
        },
        Button: {
            defaultProps: {
                radius: 'xl', // Pill shaped buttons are more modern
                fw: 600,
            },
        },
        Card: {
            defaultProps: {
                radius: 'lg',
                shadow: 'sm',
                withBorder: true,
            },
            styles: {
                root: {
                    backgroundColor: '#fff',
                    borderColor: '#f1f3f5',
                }
            }
        },
        Paper: {
            defaultProps: {
                radius: 'xl',
            }
        }
    },
});
