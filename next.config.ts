import type { NextConfig } from "next";

// /kci is proxied to the KCI demo project (market-intelligence-wine.vercel.app)
// via vercel.json rewrites — those run at the Vercel edge before Next.js and
// avoid the RSC header misinterpretation that next.config rewrites cause.

const nextConfig: NextConfig = {};

export default nextConfig;
