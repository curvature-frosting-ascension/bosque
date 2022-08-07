/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/process-estimate-sheet",
        permanent: false,
      }
    ]
  }
}

module.exports = nextConfig
