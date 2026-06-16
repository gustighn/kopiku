/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00704A',
          dark: '#004E31',
          light: '#1E9E6E',
        },
        ink: '#1E3932',
        surface: {
          soft: '#f1f8f5',
          card: '#f5f5f5'
          ,
          strong: '#d1e7dd'
        },
        body: '#374151',
        muted: '#6b7280',
        hairline: '#e5e7eb',
        'on-dark-soft': '#a1c4b5',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      spacing: {
        '4.5': '1.125rem', // 18px
        '11': '2.75rem',   // 44px
        '18': '4.5rem'
      }
    }
  },
  plugins: [],
}
