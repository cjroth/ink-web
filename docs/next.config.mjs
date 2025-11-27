import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['ink-web'],
  experimental: {
    externalDir: true,
  },
  turbopack: {
    resolveAlias: {
      ink: 'ink-web',
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ink: 'ink-web',
    };
    return config;
  },
};

export default withMDX(config);
