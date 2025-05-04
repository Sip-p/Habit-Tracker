import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './index.tsx'],
  theme: {
    extend: {
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        shine: {
          '0%': { left: '-75%' },
          '100%': { left: '125%' },
        },
        moveParticles: {
          '0%': {
            transform: 'translateX(0) translateY(0)',
            opacity: '0.5',
          },
          '50%': {
            transform: 'translateX(50px) translateY(30px)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'translateX(-50px) translateY(-40px)',
            opacity: '0.5',
          },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 3s linear infinite',
        'shine': 'shine 2.5s infinite',
        'particles': 'moveParticles 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
