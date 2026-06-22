import type { NextConfig } from "next";

// The Korean Company Intelligence demo (./korean-company-intel) is a separate
// Next.js app served as a Multi-Zone "secondary" under /kci. Set KCI_DEMO_URL to
// its deployed origin in production; defaults to the local dev port (3001).
const KCI_DEMO_URL = process.env.KCI_DEMO_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/kci", destination: `${KCI_DEMO_URL}/kci` },
      { source: "/kci/:path*", destination: `${KCI_DEMO_URL}/kci/:path*` },
    ];
  },
};

export default nextConfig;
