import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// GitHub Pages can't set HTTP security headers, so the production build adds
// a Content Security Policy as a <meta> tag instead. It tells the browser to
// load scripts, styles, and media only from this site, so injected code
// can't run or send data elsewhere.
// When the NestJS API exists, add its origin to connect-src.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  // data: covers small images Vite inlines; blob: covers local file previews.
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function contentSecurityPolicyMeta(): Plugin {
  return {
    name: 'content-security-policy-meta',
    // Only in production builds. The dev server injects inline scripts for
    // hot reload, which this policy would block.
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
        injectTo: 'head-prepend',
      },
      {
        tag: 'meta',
        attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' },
        injectTo: 'head-prepend',
      },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contentSecurityPolicyMeta()],
  // GitHub Pages serves this repo at https://git-ebrahim.github.io/learning-experimentation/,
  // so built asset URLs must start with the repository name.
  base: '/learning-experimentation/',
  build: {
    // Vite inlines small files as data: URLs. The CSP only allows fonts from
    // this site, so keep every font as its own file. Other assets use the default.
    assetsInlineLimit: (filePath) => (/\.woff2?$/.test(filePath) ? false : undefined),
  },
})
