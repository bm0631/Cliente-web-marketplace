/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
module: {
  loaders: [
    { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
  ]
}