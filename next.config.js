/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'openweathermap.org',
      // NewsAPI image sources
      'd.newsweek.com',
      'techcrunch.com',
      'cdn.vox-cdn.com',
      'static01.nyt.com',
      'www.wired.com',
      'cdn.arstechnica.net',
      'engadget.com',
      'www.theverge.com',
      // Laravel News
      'laravelnews.s3.amazonaws.com',
      'picperf.io',
      // General news sources
      'images.unsplash.com',
      'cdn.pixabay.com',
      'www.gravatar.com',
      // Common CDNs
      'i.imgur.com',
      'media.giphy.com',
      'avatars.githubusercontent.com',
      'nationalobserver.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.nationalobserver.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'repository-images.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'make.wordpress.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.theurbangent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'regmedia.co.uk',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
