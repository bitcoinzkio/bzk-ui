/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // https://github.com/wagmi-dev/wagmi/issues/3232
    config.module.unknownContextCritical = false;
    return config;
  },
};

export default nextConfig;
