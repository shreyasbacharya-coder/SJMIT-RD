import type {NextConfig} from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let basePath = '';

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath ? basePath : undefined,
  trailingSlash: true,
  experimental: {
    scrollRestoration: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sjmit.ac.in',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
