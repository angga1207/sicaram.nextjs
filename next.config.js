/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    // optimizeFonts: false,
    env: {
        APP_NAME: 'SiCaram Ogan Ilir',
        APP_NAME_ALIAS: 'SiCaram',
        APP_DESCRIPTION: 'Sistem Informasi Caram',
    },

    // avoid headers cors
    // async headers() {
    //     return [
    //         {
    //             source: '/(.*)',
    //             headers: securityHeaders,
    //         },
    //     ];
    // },
};

module.exports = nextConfig;
