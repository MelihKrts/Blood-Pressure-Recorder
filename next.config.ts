import withPWA from "next-pwa";

export default withPWA({
    experimental: { esmExternals: "loose" },
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === "development",
    },
});
