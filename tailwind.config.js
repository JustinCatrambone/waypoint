/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'bg-yellow-100',
    'bg-pink-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-purple-100'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}