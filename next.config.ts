import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isMobile = process.env.BUILD_TARGET === 'mobile';

const nextConfig: NextConfig = {
  ...(isMobile
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default withNextIntl(nextConfig);
