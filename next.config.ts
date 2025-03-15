// // @ts-ignore
// import withPWA from "next-pwa";
// import { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
//     experimental: { esmExternals: "loose" },
// };
//
// export default withPWA({
//     ...nextConfig,
//     pwa: {
//         dest: "public",
//         register: true,
//         skipWaiting: true,
//         disable: process.env.NODE_ENV === "development",
//     },
// });

import withPWA  from 'next-pwa';

const nextConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

export default nextConfig;
