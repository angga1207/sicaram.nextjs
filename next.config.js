/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    env: {
        APP_NAME: 'SiCaram Ogan Ilir',
        APP_NAME_ALIAS: 'SiCaram',
        APP_DESCRIPTION: 'Sistem Informasi Caram',
    }
};

module.exports = nextConfig;
