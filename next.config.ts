import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure docs/brand-voice.md is bundled into these API routes' serverless
  // functions on Vercel — they read it from disk at request time, and it
  // isn't picked up by static import analysis otherwise.
  outputFileTracingIncludes: {
    "/api/generate": ["./docs/brand-voice.md"],
    "/api/repurpose": ["./docs/brand-voice.md"],
  },
};

export default nextConfig;
