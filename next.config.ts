import type { NextConfig } from "next";

// The Korean Company Intelligence demo (./korean-company-intel) is its own Vercel
// project, served under /kci on this domain via a Multi-Zone rewrite. Set
// KCI_DEMO_URL to that project's origin in this app's Vercel env vars
// (e.g. https://kci-demo.vercel.app). In dev it defaults to the local demo on
// :3001. If the origin is unset in production we skip the rewrite entirely, so
// /kci 404s cleanly instead of trying to proxy a private/localhost host
// (which Vercel rejects with DNS_HOSTNAME_RESOLVED_PRIVATE).
const KCI_DEMO_URL =
  process.env.KCI_DEMO_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3001");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!KCI_DEMO_URL) return [];
    return [
      { source: "/kci", destination: `${KCI_DEMO_URL}/kci` },
      { source: "/kci/:path*", destination: `${KCI_DEMO_URL}/kci/:path*` },
    ];
  },
};

export default nextConfig;
