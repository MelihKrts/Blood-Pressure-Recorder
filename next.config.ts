import withPWAInit from "next-pwa";
import { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    webVitalsAttribution: ["CLS", "LCP"],
  },
};

export default withPWA(nextConfig);