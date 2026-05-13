// Game: Palworld Mobile - Optimization Config
export default {
  base: './', // Ensures paths work on GitHub Pages
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false
  },
  server: {
    open: true // Opens browser on local start
  }
};
