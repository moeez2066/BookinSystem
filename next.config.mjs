/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.dribbble.com',
          pathname: '/users/**/screenshots/**/media/**'
        },
      ],
    },
  };
  
  export default nextConfig;
  