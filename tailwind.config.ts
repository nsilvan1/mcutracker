import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        marvel: {
          red: '#E62429',
          dark: '#0A0A0A',
          gray: '#1A1A1A',
          lightGray: '#2A2A2A',
        },
        doomsday: {
          purple: '#6B21A8',
          blue: '#1e40af',
          cyan: '#06b6d4',
        },
      },
    },
  },
  plugins: [],
}
export default config
