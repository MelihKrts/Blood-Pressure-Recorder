// import withPWA from "next-pwa";
// import type { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
//     reactStrictMode: true,
//     swcMinify: true,
// };
//
// // @ts-ignore
// export default withPWA({
//     ...nextConfig,
//
//     pwa: {
//         dest: "public",
//         register: true,
//         skipWaiting: true,
//         disable: process.env.NODE_ENV === "development",
//     },
// });


import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    swcMinify: true,
};

export default withPWA({
    ...nextConfig,
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === "development",
    } as any, // TS hatasını önler
});
