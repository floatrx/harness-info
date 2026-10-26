import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  turbopack: {
    root: import.meta.dirname,
  },
};

// Turbopack takes remark/rehype plugins by package name only (options must be serializable).
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-slug'],
  },
});

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(withMDX(nextConfig));
