/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          },
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
          },
          {
            protocol: 'https',
            hostname: 'plus.unsplash.com',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          },
          {
            protocol: 'https',
            hostname: 'tailwindui.com',
          },
        ],
      },
    // images: {
    //     domains: ["lh3.googleusercontent.com"],
    //     domains: ["plus.unsplash.com"],
    //     domains: ["firebasestorage.googleapis.com"],
    //     domains: ["lh3.googleusercontent.com"],
    // }
};

export default nextConfig;
