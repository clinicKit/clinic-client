import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FAFAF8',
          secondary: '#F5F4F0',
          card: '#FFFFFF',
        },
        accent: {
          50: '#F0F7F4',
          100: '#D4EDE3',
          200: '#A8DBC8',
          500: '#5BAA8E',
          600: '#4A9A7C',
          700: '#3D7A64',
        },
        amber: {
          50: '#FFF8F0',
          100: '#FFEDD5',
          500: '#F5A623',
          600: '#E09515',
        },
        text: {
          primary: '#2C3E3A',
          secondary: '#6B7F7A',
          muted: '#9BAFAA',
        },
        border: {
          DEFAULT: '#E6EAE8',
          light: '#F0F2F1',
        },
        status: {
          scheduled: '#5BAA8E',
          confirmed: '#4A9A7C',
          cancelled: '#E8A0A0',
          noshow: '#C4A0A0',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(44, 62, 58, 0.06)',
        md: '0 4px 12px rgba(44, 62, 58, 0.08)',
        lg: '0 8px 24px rgba(44, 62, 58, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;