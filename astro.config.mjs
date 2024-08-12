import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
import org from "astro-org";
import rehypeRaw from "rehype-raw";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __base = 'blog';

// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// https://astro.build/config
export default defineConfig( /** @type {import('astro').AstroUserConfig} */{
  // root: '.',     // Where to resolve all URLs relative to. Useful if you have a monorepo project.
  // outDir: './dist',       // When running `astro build`, path to final static output
  // publicDir: './public',   // A folder of static files Astro will copy to the root. Useful for favicons, images, and other files that don’t need processing.
  output: 'static',
  site: 'https://cj-bc.github.io',
  base: 'blog',
  redirects: {
    '/posts/[slug].html': '/blog/posts/[slug]/',
  },
  // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
  server: {
    // port: 3000,         // The port to run the dev server on.
  },
  integrations: [
    markdoc(), // disabled now due to an issue with Vercel builds
    svelte(), 
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    sitemap(),
    org({rehypePlugins: [rehypeRaw]})
  ],
  vite: {
    plugins: [],
    resolve: {
      alias: {
        '$': path.resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      allowNodeBuiltins: true
    }
  },
});
