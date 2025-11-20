import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['ink-web'],
  experimental: {
    externalDir: true,
  },
};

export default withMDX(config);
