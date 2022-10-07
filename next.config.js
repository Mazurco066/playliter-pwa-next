// Enviroment
const isProd = process.env.NODE_ENV === 'production'

// Nextjs plugins
const { createSecureHeaders } = require('next-secure-headers')
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: !isProd
})


/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: false, // Disabled because 'react-beautiful-dnd' doesn't work while enabled
  swcMinify: true,
  // Disable eslint during builds
  eslint: {
    ignoreDuringBuilds: true
  },
  // Secure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders({
           contentSecurityPolicy: {
            directives: {
              baseUri: 'self',
              formAction: 'self',
              frameAncestors: true
            },
          },
          frameGuard: 'deny',
          noopen: 'noopen',
          nosniff: 'nosniff',
          xssProtection: 'sanitize',
          forceHTTPSRedirect: [ true, {
            maxAge: 60 * 60 * 24 * 360,
            includeSubDomains: true
          }],
          referrerPolicy: 'same-origin'
        })
      }
    ]
  }
})

module.exports = nextConfig
