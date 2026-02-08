import withPWA from "next-pwa";
import {NextConfig} from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        webVitalsAttribution: ["CLS", "LCP"]
    }
};

export default withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
})(nextConfig as any);
