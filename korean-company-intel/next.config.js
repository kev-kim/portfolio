/** @type {import('next').NextConfig} */

// Served as a Next.js Multi-Zone "secondary" app under /kci on the portfolio
// domain (the portfolio rewrites /kci/* here — see ../next.config.ts). basePath
// defaults to /kci so the app is correctly addressable standalone and when
// proxied; override with NEXT_PUBLIC_BASE_PATH to mount at a different prefix.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/kci"

const nextConfig = {
  // basePath auto-prefixes all routes, <Link>/router navigations, and /_next
  // assets, so the app is correctly addressable when proxied under the prefix.
  basePath: basePath || undefined,
  // Config redirects ARE basePath-aware (unlike a server-component redirect()),
  // so "/" → "/dashboard" becomes "/kci" → "/kci/dashboard" when prefixed.
  async redirects() {
    return [{ source: "/", destination: "/dashboard", permanent: false }]
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

module.exports = nextConfig
