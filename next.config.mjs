/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'mayra.majetics.com',
          pathname: '/wp-content/uploads/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  