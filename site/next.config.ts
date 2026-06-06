import type { NextConfig } from 'next';
import { assertToolarsProductionEnv } from './lib/env/release-gate';

assertToolarsProductionEnv();

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
