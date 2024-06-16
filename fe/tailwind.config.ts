import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      zIndex: {
        '100': '100',
        '200': '200',
      },
      fontFamily: {
        primary: ['Commissioner', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: 'var(--primary)',
        primaryDark: 'var(--primary-dark)',
        mainRed: 'rgba(217, 69, 57, 1)',
        mainRedDark: 'rgb(131, 47, 39)',
        addRed: 'rgba(247, 233, 231, 1)',
        addRedDark: 'rgb(184, 174, 172)',
        addBlue: 'rgba(230, 241, 247, 1)',
        appLightBlue: 'rgba(132, 191, 223, 1)',
        appIconBlue: 'rgba(108, 183, 249, 1)',
        infoBg: 'rgba(206, 224, 234, 1)',
        errorBg: 'rgba(233, 187, 183, 1)',
        textGray: 'rgba(161, 160, 179, 1)',
        textBlue: 'var(--text-blue)',
        textLight: 'rgba(160, 163, 179, 1)',
        textRed: 'rgba(201, 138, 133, 1)',
        strokeLight: 'rgba(208, 211, 222, 1)',
        mainBg: 'rgba(235, 235, 235, 1)',
        appGray: 'rgba(248, 248, 251, 1)',
        overlayBg: 'rgba(0, 0, 0, 0.2)',
        appGrayBorder: 'rgba(241, 240, 240, 1)',
        blue50: 'rgba(242, 250, 255, 1)',
        blackBg: 'rgba(38, 37, 53, 1)',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite-typography')],
} satisfies Config;
