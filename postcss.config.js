import tailwind from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwind(), // use the new PostCSS plugin
    autoprefixer,
  ],
}
