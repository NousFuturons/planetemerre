// next.config.mjs
export default {
    experimental: {
      optimizePackageImports: ['@chakra-ui/react']
    },
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
      return config;
    }
  }
  