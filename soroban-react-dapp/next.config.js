/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
let nextConfig = {
  transpilePackages: [
    // Fix for warnings about cjs/esm package duplication
    // See: https://github.com/polkadot-js/api/issues/5636
    '**@polkadot/**',
  ],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

const withTwin = require('./withTwin.js')
nextConfig = withTwin(nextConfig)

module.exports = nextConfig
